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
const PostUpdateFeedMessagesLambda_1 = require("./lambda/PostUpdateFeedMessagesLambda");
const DynamoUserDAO_1 = require("./dao/dynamo/DynamoUserDAO");
const DynamoAuthenticationDAO_1 = require("./dao/dynamo/DynamoAuthenticationDAO");
const DynamoAuthTokenDAO_1 = require("./dao/dynamo/DynamoAuthTokenDAO");
const DynamoFollowDAO_1 = require("./dao/dynamo/DynamoFollowDAO");
const UserService_1 = require("./model/service/UserService");
const DynamoDAOFactory_1 = require("./dao/dynamo/DynamoDAOFactory");
const DynamoStatusDAO_1 = require("./dao/dynamo/DynamoStatusDAO");
const DynamoFeedDAO_1 = require("./dao/dynamo/DynamoFeedDAO");
const StatusService_1 = require("./model/service/StatusService");
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        // const user = new User(
        //   "a",
        //   "a",
        //   "@r",
        //   "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
        // );
        // await new DynamoUserDAO().putUser(user);
        let req = new tweeter_shared_1.LoginRequest("r", "password");
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
        let req = new tweeter_shared_1.RegisterRequest("riley", "a", "riley", "password", "image");
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
        const followee = new tweeter_shared_1.User("a", "s", "@abbie", "image/url");
        const dao_2 = new DynamoUserDAO_1.DynamoUserDAO();
        const put = yield dao_2.putUser(followee);
        console.log("AUTHENTICATION");
        let login = new tweeter_shared_1.LoginRequest("riley", "a");
        console.log(JSON.stringify(login));
        let login_response = JSON.stringify(yield (0, LoginLambda_1.handler)(login));
        console.log(login_response);
        let login_responseJson = JSON.parse(login_response);
        const authResp = tweeter_shared_1.AuthenticateResponse.fromJson(login_responseJson);
        console.log(authResp);
        console.log("\n");
        // let user_req = new TweeterRequest("@r", authResp.token);
        // console.log(JSON.stringify(user_req));
        // let user_resp = JSON.stringify(await getUserHandler(user_req));
        // console.log(user_resp);
        // let user_responseJson = JSON.parse(user_resp);
        // const user_response = GetUserResponse.fromJson(user_responseJson);
        // console.log(user_response);
        // console.log("\n");
        // const follower = user_response.user!;
        console.log("FOLLOW");
        let req = new tweeter_shared_1.FollowRequest("a", authResp.token, followee);
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
        const token = new tweeter_shared_1.AuthToken("token", Date.now());
        const dao = new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
        yield dao.putAuthToken(token, "@r");
        let req = new tweeter_shared_1.TweeterRequest("@r", token);
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, GetUserLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.GetUserResponse.fromJson(responseJson));
        console.log("\n");
        yield dao.deleteAuthToken(token);
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
function test_user_dao() {
    return __awaiter(this, void 0, void 0, function* () {
        const dao = new DynamoUserDAO_1.DynamoUserDAO();
        const user = yield dao.getUser("@r");
        console.log(user);
        // const user_2 = new User("abbie", "sinema", "@ab", "/image/url/abbie");
        // const put = await dao.putUser(user_2);
        // console.log(put);
        // const put_2 = await dao.putUser(user_2);
        // console.log(put_2);
    });
}
function test_auth_dao() {
    return __awaiter(this, void 0, void 0, function* () {
        const dao = new DynamoAuthenticationDAO_1.DynamoAuthenticationDAO();
        const username = "r";
        const password = "password";
        const valid = yield dao.getPassword(username);
        console.log(valid);
    });
}
function test_token_dao() {
    return __awaiter(this, void 0, void 0, function* () {
        const dao = new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
        let token = tweeter_shared_1.AuthToken.Generate();
        console.log(token);
        token.timestamp = token.timestamp - 6000000;
        console.log(token);
        yield dao.putAuthToken(token, "");
        const token_2 = yield dao.checkAuthToken(token);
        console.log(token_2);
    });
}
function test_follow() {
    return __awaiter(this, void 0, void 0, function* () {
        const dao = new DynamoFollowDAO_1.DynamoFollowDAO();
        // const dao_2 = new DynamoUserDAO();
        const follower = new tweeter_shared_1.User("r", "s", "@riley", "image/url");
        const followee = new tweeter_shared_1.User("a", "s", "@abbie", "image/url");
        // const put = await dao_2.putUser(followee);
        yield dao.putFollow(new tweeter_shared_1.Follow(follower, followee));
        const status = yield dao.getFollow(new tweeter_shared_1.Follow(follower, followee));
        console.log(status);
    });
}
function test_get_follow_count() {
    return __awaiter(this, void 0, void 0, function* () {
        const dao = new DynamoFollowDAO_1.DynamoFollowDAO();
        const token = tweeter_shared_1.AuthToken.Generate();
        const authDAO = new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
        const user = new tweeter_shared_1.User("a", "a", "@riley", "imag");
        yield new DynamoUserDAO_1.DynamoUserDAO().putUser(user);
        yield authDAO.putAuthToken(token, user.alias);
        const user_2 = new tweeter_shared_1.User("a", "a", "@abbie", "imag");
        yield new DynamoUserDAO_1.DynamoUserDAO().putUser(user_2);
        const service = new UserService_1.UserService(new DynamoDAOFactory_1.DynamoDAOFactory());
        const [ab_followers, ab_followees] = yield service.follow(token, user_2);
        console.log(ab_followers, ab_followees);
    });
}
function test_login_logout() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoginRequest("r", "password");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LoginLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        console.log(tweeter_shared_1.AuthenticateResponse.fromJson(responseJson));
        console.log("\n");
        let req_2 = new tweeter_shared_1.TweeterRequest("@r", tweeter_shared_1.AuthenticateResponse.fromJson(responseJson).token
        // new AuthToken("token", 10)
        );
        console.log(JSON.stringify(req_2));
        let response_2 = JSON.stringify(yield (0, LogoutLambda_1.handler)(req_2));
        console.log(response_2);
        let responseJson_2 = JSON.parse(response_2);
        console.log(tweeter_shared_1.TweeterResponse.fromJson(responseJson_2));
        console.log("\n");
    });
}
function put_user() {
    return __awaiter(this, void 0, void 0, function* () {
        const nameList = [
            "Allen",
            "Bob",
            "Riley",
            "Mark",
            "Brad",
            "Tyler",
            "Zach",
            "Frank",
            "Abbie",
            "Kaylee",
            "Lilly",
        ];
        const lastNameList = [
            "Johnson",
            "Smith",
            "Williams",
            "Sinema",
            "Bell",
            "Doe",
            "Jensen",
        ];
        for (let i = 0; i < 20; i++) {
            const user = new tweeter_shared_1.User(nameList[Math.floor(Math.random() * nameList.length)], lastNameList[Math.floor(Math.random() * lastNameList.length)], "@user_" + String(i), "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
            const dao = new DynamoUserDAO_1.DynamoUserDAO();
            const put = yield dao.putUser(user);
        }
    });
}
function delete_follow() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoginRequest("abley", "password");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LoginLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        const auth_resp = tweeter_shared_1.AuthenticateResponse.fromJson(responseJson);
        console.log(auth_resp);
        console.log("\n");
        const followee = new tweeter_shared_1.User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        let uf_req = new tweeter_shared_1.FollowRequest(auth_resp.user.alias, auth_resp.token, followee);
        console.log(JSON.stringify(uf_req));
        let uf_response = JSON.stringify(yield (0, FollowLambda_1.handler)(uf_req));
        console.log(uf_response);
        let un_responseJson = JSON.parse(uf_response);
        console.log(tweeter_shared_1.FollowResponse.fromJson(un_responseJson));
        console.log("\n");
    });
}
function test_load_more_followers() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = new tweeter_shared_1.AuthToken("token", 10);
        const user = new tweeter_shared_1.User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        const req = new tweeter_shared_1.LoadMoreUsersRequest("", token, user, null, 5, "followers");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LoadMoreUsersLambda_1.handler)(req));
        // console.log(response);
        let responseJson = JSON.parse(response);
        // console.log(responseJson);
        console.log(tweeter_shared_1.LoadMoreUsersResponse.fromJson(responseJson));
        console.log("\n");
    });
}
function test_post_with_feed_attatched() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoginRequest("abley", "password");
        console.log(JSON.stringify(req));
        let response = JSON.stringify(yield (0, LoginLambda_1.handler)(req));
        console.log(response);
        let responseJson = JSON.parse(response);
        const auth_resp = tweeter_shared_1.AuthenticateResponse.fromJson(responseJson);
        console.log(auth_resp);
        console.log("\n");
        const post = new tweeter_shared_1.Status("trying feed capabilities", auth_resp.user, Date.now());
        const req_2 = new tweeter_shared_1.PostStatusRequest("", auth_resp.token, post);
        console.log(JSON.stringify(req_2));
        const response_2 = JSON.stringify(yield (0, PostStatusLambda_1.handler)(req_2));
        console.log(response_2);
        const responseJson_2 = JSON.parse(response_2);
        console.log(tweeter_shared_1.TweeterResponse.fromJson(responseJson_2));
        console.log("\n");
    });
}
function test_get_page_status() {
    return __awaiter(this, void 0, void 0, function* () {
        const statusDAO = new DynamoStatusDAO_1.DynamoStatusDAO();
        const userDAO = new DynamoUserDAO_1.DynamoUserDAO();
        const user = new tweeter_shared_1.User("a", "a", "@abley", "image");
        const [alias_timestamps, hasMorePages] = yield statusDAO.getPageOfStatus(user.alias, 5, undefined);
        let statusList = [];
        for (let i = 0; i < alias_timestamps.length; i++) {
            let user = yield userDAO.getUser(alias_timestamps[i][0]);
            if (!!user) {
                let status = yield statusDAO.getStatus(alias_timestamps[i][0], alias_timestamps[i][1], user);
                if (!!status) {
                    statusList.push(status);
                }
            }
        }
        console.log(statusList);
    });
}
function put_follows() {
    return __awaiter(this, void 0, void 0, function* () {
        const followee = new tweeter_shared_1.User("riley", "sinema", "@riley", "image");
        for (let i = 0; i < 20; i++) {
            const follower = new tweeter_shared_1.User("a", "a", "@user_" + String(i), "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
            const dao = new DynamoFollowDAO_1.DynamoFollowDAO();
            const put = yield dao.putFollow(new tweeter_shared_1.Follow(follower, followee));
        }
    });
}
function put_batch_feed() {
    return __awaiter(this, void 0, void 0, function* () {
        const dao = new DynamoFeedDAO_1.DynamoFeedDAO();
        const service = new StatusService_1.StatusService(new DynamoDAOFactory_1.DynamoDAOFactory());
        const user = new tweeter_shared_1.User("a", "a", "@riley", "image");
        const status = new tweeter_shared_1.Status("test_post", user, 10);
        const aliasList = [];
        const alias_string = "@user_";
        for (let i = 1; i < 26; i++) {
            aliasList.push(alias_string + i);
        }
        // await dao.putBatchOfFeedItems(aliasList, status);
        // await service.postToFeed(aliasList, status);
        const event = {
            Records: [
                {
                    body: JSON.stringify({ ["aliasList"]: aliasList, ["status"]: status }),
                },
            ],
        };
        const jsonObj = JSON.parse(JSON.stringify({ ["aliasList"]: aliasList, ["status"]: status }));
        console.log(jsonObj.aliasList.length);
        (0, PostUpdateFeedMessagesLambda_1.handler)(event);
        // updateFeedHandler(event);
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
        // await loadmoreusers();
        // await test_user_dao();
        // await test_auth_dao();
        // await test_token_dao();
        // await test_follow_status();
        // await test_get_follow_count();
        // await test_login_logout();
        // await test_follow();
        // await put_user();
        // await put_follows();
        // await delete_follow();
        // await test_load_more_followers();
        // await test_get_page_status();
        // await test_post_with_feed_attatched();
        yield put_batch_feed();
        // const L = 147;
        // for (let i = 0; i < L; i = i + 25) {
        //   console.log(i);
        //   let k = i + 25;
        //   if (k > L) {
        //     k = L;
        //   }
        //   let s = "";
        //   for (let j = i; j < k; j++) {
        //     s = s + " " + j;
        //   }
        //   console.log(s);
        // }
    });
}
test();
// dist % zip -r ../dist.zip *
// cp -rL node_modules nodejs
// zip -r nodejs.zip nodejs
