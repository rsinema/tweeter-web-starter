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
class UserService {
    constructor(daoFactory) {
        this.daoFactory = daoFactory;
    }
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            authToken = new tweeter_shared_1.AuthToken(authToken.token, authToken.timestamp);
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
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticationDAO = this.daoFactory.getAuthenticationDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const valid = yield authenticationDAO.authenticate(alias, password);
            if (valid === false) {
                throw new Error("Invalid alias or password");
            }
            alias = "@" + alias;
            const user = yield userDAO.getUser(alias);
            if (user === undefined) {
                throw new Error("Could not find user in database");
            }
            const token = tweeter_shared_1.AuthToken.Generate();
            authTokenDAO.putAuthToken(token, user.alias);
            return [user, token];
        });
    }
    logout(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            yield authTokenDAO.deleteAuthToken(authToken);
        });
    }
    register(firstName, lastName, alias, password, imageStringBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticationDAO = this.daoFactory.getAuthenticationDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            // TODO:: Make the S3 DAO
            const username = alias;
            alias = "@" + alias;
            const user = new tweeter_shared_1.User(firstName, lastName, alias, "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
            const valid = yield userDAO.putUser(user);
            if (valid === false) {
                throw new Error("Invalid registration");
            }
            yield authenticationDAO.putAuthentication(username, password);
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
            yield followDAO.putFollow(new tweeter_shared_1.Follow(userThatIsFollowing, userToUnfollow));
            yield userDAO.updateFollowersCount(userToUnfollow.alias, -1);
            yield userDAO.updateFolloweesCount(userThatIsFollowing.alias, -1);
            const followers = yield userDAO.getFollowersCount(userToUnfollow.alias);
            const followees = yield userDAO.getFolloweesCount(userToUnfollow.alias);
            return [followers, followees];
        });
    }
}
exports.UserService = UserService;
