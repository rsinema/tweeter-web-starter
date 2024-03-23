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
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
        });
    }
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling the server
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (user === null) {
                throw new Error("Invalid alias or password");
            }
            return [user, tweeter_shared_1.FakeData.instance.authToken];
        });
    }
    logout(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((res) => setTimeout(res, 1000));
        });
    }
    register(firstName, lastName, alias, password, imageStringBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (user === null) {
                throw new Error("Invalid registration");
            }
            return [user, tweeter_shared_1.FakeData.instance.authToken];
        });
    }
    getIsFollowerStatus(authToken, user, selectedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweeter_shared_1.FakeData.instance.isFollower();
        });
    }
    getFollowersCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling server
            return tweeter_shared_1.FakeData.instance.getFollowersCount(user);
        });
    }
    getFolloweesCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling server
            return tweeter_shared_1.FakeData.instance.getFolloweesCount(user);
        });
    }
    follow(authToken, userToFollow) {
        return __awaiter(this, void 0, void 0, function* () {
            let followersCount = yield this.getFollowersCount(authToken, userToFollow);
            let followeesCount = yield this.getFolloweesCount(authToken, userToFollow);
            followersCount++;
            return [followersCount, followeesCount];
        });
    }
    unfollow(authToken, userToUnfollow) {
        return __awaiter(this, void 0, void 0, function* () {
            let followersCount = yield this.getFollowersCount(authToken, userToUnfollow);
            let followeesCount = yield this.getFolloweesCount(authToken, userToUnfollow);
            followersCount--;
            return [followersCount, followeesCount];
        });
    }
}
exports.UserService = UserService;
