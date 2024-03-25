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
const tweeter_shared_1 = require("tweeter-shared");
const LoginLambda_1 = require("./lambda/LoginLambda");
const RegisterLambda_1 = require("./lambda/RegisterLambda");
const FollowLambda_1 = require("./lambda/FollowLambda");
const UnfollowLambda_1 = require("./lambda/UnfollowLambda");
const LogoutLambda_1 = require("./lambda/LogoutLambda");
const GetUserLambda_1 = require("./lambda/GetUserLambda");
const FollowStatusLambda_1 = require("./lambda/FollowStatusLambda");
const LoadMoreStoryItemsLambda_1 = require("./lambda/LoadMoreStoryItemsLambda");
const PostStatusLambda_1 = require("./lambda/PostStatusLambda");
const GetFollowCountLambda_1 = require("./lambda/GetFollowCountLambda");
const LoadMoreUsersLambda_1 = require("./lambda/LoadMoreUsersLambda");
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoginRequest("a", "a");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LoginLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.AuthenticateResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function register() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.RegisterRequest("a", "a", "a", "a", "image");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, RegisterLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.AuthenticateResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        let req = new tweeter_shared_1.TweeterRequest("a", token);
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LogoutLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.TweeterResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function follow() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        const user = new tweeter_shared_1.User("first", "last", "a", "url");
        let req = new tweeter_shared_1.FollowRequest("a", token, user);
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, FollowLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.FollowResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function unfollow() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        const user = new tweeter_shared_1.User("first", "last", "a", "url");
        let req = new tweeter_shared_1.FollowRequest("a", token, user);
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, UnfollowLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.FollowResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function getuser() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        let req = new tweeter_shared_1.TweeterRequest("@bob", token);
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, GetUserLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.GetUserResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function getfollowstatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        const user = new tweeter_shared_1.User("first", "last", "a", "url");
        const selectedUser = new tweeter_shared_1.User("first", "last", "a", "url");
        let req = new tweeter_shared_1.FollowStatusRequest("@bob", token, user, selectedUser);
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, FollowStatusLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.FollowStatusResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function poststatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        const user = new tweeter_shared_1.User("first", "last", "a", "url");
        const post = new tweeter_shared_1.Status("a", user, 10);
        const req = new tweeter_shared_1.PostStatusRequest("", token, post);
        console.log(JSON.stringify(req));
        const response = JSON.stringify(yield (0, PostStatusLambda_1.handler)(req));
        console.log(response);
        const responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.TweeterResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function loadmoreitems() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new tweeter_shared_1.User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        const status = new tweeter_shared_1.Status("Post 0 0 \nMy friend @amy likes this website: http://byu.edu. Do you? \nOr do you prefer this one: http://cs.byu.edu?", user, 0);
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        const req = new tweeter_shared_1.LoadMoreItemsRequest("@bob", token, user, status, 1);
        // console.log(Status.fromJson(JSON.stringify(status as unknown as JSON)));
        // let user_2 = JSON.parse(JSON.stringify(user));
        // console.log(user.equals(user_2));
        // const list = [status, status, status];
        // const itemsList = listJson as unknown as Array<Status>;
        // console.log(itemsList);
        // console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LoadMoreStoryItemsLambda_1.handler)(req));
        // const itemsList = jsonObject._itemsList as unknown as Array<Status>;
        // console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.LoadMoreItemsResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function getfollowerscount() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        const user = new tweeter_shared_1.User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        const req = new tweeter_shared_1.GetFollowCountRequest("", token, user, "followees");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, GetFollowCountLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.GetFollowCountResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function loadmoreusers() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("12345", 10);
        const user = new tweeter_shared_1.User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        const user_2 = new tweeter_shared_1.User("Amy", "Ames", "@amy", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        const req = new tweeter_shared_1.LoadMoreUsersRequest("", token, user, user_2, 5, "followers");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LoadMoreUsersLambda_1.handler)(req));
        // console.log(response);
        let responseJson = JSON.parse(response);
        // console.log(responseJson);
        console.log(tweeter_shared_1.LoadMoreUsersResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        // await login();
        // await register();
        // await logout();
        // await follow();
        // await unfollow();
        // await getuser();
        // await getfollowstatus();
        // await poststatus();
        // await loadmoreitems();
        // await getfollowerscount();
        yield loadmoreusers();
    });
}
test();
// dist % zip -r ../dist.zip *
// cp -rL node_modules nodejs
// zip -r nodejs.zip nodejs
