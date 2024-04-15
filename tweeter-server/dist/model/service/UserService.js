"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const bcryptjs_1 = require("bcryptjs");
class UserService {
    constructor(daoFactory) {
        this.daoFactory = daoFactory;
    }
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const validToken = yield authTokenDAO.checkAuthToken(authToken);
            if (validToken === undefined) {
                throw new Error("This session token has expired. Please log back in");
            }
            const user = yield userDAO.getUser(alias);
            if (user === undefined) {
                return null;
            }
            return user;
        });
    }
    getUserFromAlias(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daoFactory.getUserDAO();
            const user = yield userDAO.getUser(alias);
            if (user === undefined) {
                return null;
            }
            return user;
        });
    }
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticationDAO = this.daoFactory.getAuthenticationDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const hashed_password = yield authenticationDAO.getPassword(alias);
            if (hashed_password === undefined) {
                throw new Error("[Database Error] Unable to retrieve data from database");
            }
            const valid = yield this.authenticate(password, hashed_password);
            if (!valid) {
                throw new Error("[Bad Request] Invalid username or password");
            }
            alias = "@" + alias;
            const user = yield userDAO.getUser(alias);
            if (user === undefined) {
                throw new Error("[Database Error] Could not find user in database");
            }
            const token = tweeter_shared_1.AuthToken.Generate();
            yield authTokenDAO.putAuthToken(token, user.alias);
            return [user, token];
        });
    }
    logout(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const [token, alias] = yield authTokenDAO.checkAuthToken(authToken);
            if (token === undefined) {
                throw new Error("This session token has expired. Please log back in");
            }
            yield authTokenDAO.deleteAuthToken(authToken);
        });
    }
    register(firstName, lastName, alias, password, imageStringBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticationDAO = this.daoFactory.getAuthenticationDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const s3DAO = this.daoFactory.getFileDAO();
            const username = alias;
            alias = "@" + alias;
            const userImageURL = yield s3DAO.putFile(imageStringBase64, alias);
            const user = new tweeter_shared_1.User(firstName, lastName, alias, userImageURL);
            const valid = yield userDAO.putUser(user);
            if (valid === false) {
                throw new Error("[Bad Request] Invalid registration");
            }
            const salt = yield (0, bcryptjs_1.genSalt)(10);
            const hashed_password = yield (0, bcryptjs_1.hash)(password, salt);
            yield authenticationDAO.putAuthentication(username, hashed_password, salt);
            const token = tweeter_shared_1.AuthToken.Generate();
            yield authTokenDAO.putAuthToken(token, user.alias);
            return [user, token];
        });
    }
    getIsFollowerStatus(authToken, user, selectedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const followDAO = this.daoFactory.getFollowDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const token = yield authTokenDAO.checkAuthToken(authToken);
            if (token === undefined) {
                throw new Error("This session's token has expired. Please sign in and try again");
            }
            const follow = new tweeter_shared_1.Follow(user, selectedUser);
            const isFollower = yield followDAO.getFollow(follow);
            return isFollower;
        });
    }
    getFollowersCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const token = yield authTokenDAO.checkAuthToken(authToken);
            if (token === undefined) {
                throw new Error("This session's token has expired. Please sign in and try again");
            }
            const count = yield userDAO.getFollowersCount(user.alias);
            return count;
        });
    }
    getFolloweesCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const token = yield authTokenDAO.checkAuthToken(authToken);
            if (token === undefined) {
                throw new Error("This session's token has expired. Please sign in and try again");
            }
            const count = yield userDAO.getFolloweesCount(user.alias);
            return count;
        });
    }
    follow(authToken, userToFollow) {
        return __awaiter(this, void 0, void 0, function* () {
            const followDAO = this.daoFactory.getFollowDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const [token, alias] = yield authTokenDAO.checkAuthToken(authToken);
            if (token === undefined) {
                throw new Error("This session's token has expired. Please sign in and try again");
            }
            const userThatIsFollowing = yield userDAO.getUser(alias);
            if (userThatIsFollowing === undefined) {
                throw new Error("User not found in the database");
            }
            yield followDAO.putFollow(new tweeter_shared_1.Follow(userThatIsFollowing, userToFollow));
            yield userDAO.updateFollowersCount(userToFollow.alias, 1);
            yield userDAO.updateFolloweesCount(userThatIsFollowing.alias, 1);
            const followers = yield userDAO.getFollowersCount(userToFollow.alias);
            const followees = yield userDAO.getFolloweesCount(userToFollow.alias);
            return [followers, followees];
        });
    }
    unfollow(authToken, userToUnfollow) {
        return __awaiter(this, void 0, void 0, function* () {
            const followDAO = this.daoFactory.getFollowDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const [token, alias] = yield authTokenDAO.checkAuthToken(authToken);
            if (token === undefined) {
                throw new Error("This session's token has expired. Please sign in and try again");
            }
            const userThatIsFollowing = yield userDAO.getUser(alias);
            yield followDAO.deleteFollow(new tweeter_shared_1.Follow(userThatIsFollowing, userToUnfollow));
            yield userDAO.updateFollowersCount(userToUnfollow.alias, -1);
            yield userDAO.updateFolloweesCount(userThatIsFollowing.alias, -1);
            const followers = yield userDAO.getFollowersCount(userToUnfollow.alias);
            const followees = yield userDAO.getFolloweesCount(userToUnfollow.alias);
            return [followers, followees];
        });
    }
    authenticate(password, hashed_password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, bcryptjs_1.compare)(password, hashed_password);
        });
    }
}
exports.UserService = UserService;
