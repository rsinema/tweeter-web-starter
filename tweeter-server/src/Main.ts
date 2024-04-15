import {
  LoadMoreItemsResponse,
  AuthToken,
  AuthenticateResponse,
  FollowRequest,
  FollowResponse,
  FollowStatusRequest,
  FollowStatusResponse,
  GetUserResponse,
  LoginRequest,
  RegisterRequest,
  Status,
  TweeterRequest,
  TweeterResponse,
  User,
  LoadMoreItemsRequest,
  PostStatusRequest,
  GetFollowCountRequest,
  GetFollowCountResponse,
  LoadMoreUsersRequest,
  LoadMoreUsersResponse,
  Follow,
} from "tweeter-shared";
import { handler as loginHandler } from "./lambda/LoginLambda";
import { handler as registerHandler } from "./lambda/RegisterLambda";
import { handler as followHandler } from "./lambda/FollowLambda";
import { handler as unfollowHandler } from "./lambda/UnfollowLambda";
import { handler as logoutHandler } from "./lambda/LogoutLambda";
import { handler as getUserHandler } from "./lambda/GetUserLambda";
import { handler as followStatusHandler } from "./lambda/FollowStatusLambda";
import { handler as loadMoreItemsHandler } from "./lambda/LoadMoreStoryItemsLambda";
import { handler as postStatusHandler } from "./lambda/PostStatusLambda";
import { handler as getFollowHandler } from "./lambda/GetFollowCountLambda";
import { handler as loadMoreUsersHandler } from "./lambda/LoadMoreUsersLambda";
import { handler as updateFeedHandler } from "./lambda/UpdateFeedsLambda";
import { handler as postUpdateFeedMessageHandler } from "./lambda/PostUpdateFeedMessagesLambda";
import { DynamoUserDAO } from "./dao/dynamo/DynamoUserDAO";
import { DynamoAuthenticationDAO } from "./dao/dynamo/DynamoAuthenticationDAO";
import { DynamoAuthTokenDAO } from "./dao/dynamo/DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "./dao/dynamo/DynamoFollowDAO";
import { UserService } from "./model/service/UserService";
import { DynamoDAOFactory } from "./dao/dynamo/DynamoDAOFactory";
import { DynamoStatusDAO } from "./dao/dynamo/DynamoStatusDAO";
import { DynamoFeedDAO } from "./dao/dynamo/DynamoFeedDAO";
import { StatusService } from "./model/service/StatusService";
import { writeFileSync } from "fs";

async function login() {
  // const user = new User(
  //   "a",
  //   "a",
  //   "@r",
  //   "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  // );
  // await new DynamoUserDAO().putUser(user);
  let req = new LoginRequest("r", "password");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await loginHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(AuthenticateResponse.fromJson(responseJson));
  console.log("\n");
}

async function register() {
  let req = new RegisterRequest("riley", "a", "riley", "password", "image");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await registerHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(AuthenticateResponse.fromJson(responseJson));
  console.log("\n");
}

async function logout() {
  const token = new AuthToken("12345", 10);
  let req = new TweeterRequest("a", token);
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await logoutHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(TweeterResponse.fromJson(responseJson));
  console.log("\n");
}

async function follow() {
  const followee = new User("a", "s", "@abbie", "image/url");
  const dao_2 = new DynamoUserDAO();
  const put = await dao_2.putUser(followee);

  console.log("AUTHENTICATION");
  let login = new LoginRequest("riley", "a");
  console.log(JSON.stringify(login));
  let login_response = JSON.stringify(await loginHandler(login));
  console.log(login_response);
  let login_responseJson = JSON.parse(login_response);
  const authResp = AuthenticateResponse.fromJson(login_responseJson);
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
  let req = new FollowRequest("a", authResp.token, followee);
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await followHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(FollowResponse.fromJson(responseJson));
  console.log("\n");
}

async function unfollow() {
  const token = new AuthToken("12345", 10);
  const user = new User("first", "last", "a", "url");
  let req = new FollowRequest("a", token, user);
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await unfollowHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(FollowResponse.fromJson(responseJson));
  console.log("\n");
}

async function getuser() {
  const token = new AuthToken("token", Date.now());
  const dao = new DynamoAuthTokenDAO();
  await dao.putAuthToken(token, "@r");
  let req = new TweeterRequest("@r", token);
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await getUserHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(GetUserResponse.fromJson(responseJson));
  console.log("\n");
  await dao.deleteAuthToken(token);
}

async function getfollowstatus() {
  const token = new AuthToken("12345", 10);
  const user = new User("first", "last", "a", "url");
  const selectedUser = new User("first", "last", "a", "url");
  let req = new FollowStatusRequest("@bob", token, user, selectedUser);
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await followStatusHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(FollowStatusResponse.fromJson(responseJson));
  console.log("\n");
}

async function poststatus() {
  const token = new AuthToken("12345", 10);
  const user = new User("first", "last", "a", "url");
  const post = new Status("a", user, 10);

  const req = new PostStatusRequest("", token, post);
  console.log(JSON.stringify(req));
  const response = JSON.stringify(await postStatusHandler(req));
  console.log(response);
  const responseJson = JSON.parse(response);
  console.log(TweeterResponse.fromJson(responseJson));
  console.log("\n");
}

async function loadmoreitems() {
  const user = new User(
    "Allen",
    "Anderson",
    "@allen",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  );
  const status = new Status(
    "Post 0 0 \nMy friend @amy likes this website: http://byu.edu. Do you? \nOr do you prefer this one: http://cs.byu.edu?",
    user,
    0
  );
  const token = new AuthToken("12345", 10);
  const req = new LoadMoreItemsRequest("@bob", token, user, status, 1);

  // console.log(Status.fromJson(JSON.stringify(status as unknown as JSON)));
  // let user_2 = JSON.parse(JSON.stringify(user));
  // console.log(user.equals(user_2));
  // const list = [status, status, status];
  // const itemsList = listJson as unknown as Array<Status>;
  // console.log(itemsList);
  // console.log(JSON.stringify(req));
  let response = JSON.stringify(await loadMoreItemsHandler(req));
  // const itemsList = jsonObject._itemsList as unknown as Array<Status>;
  // console.log(response);
  let responseJson = JSON.parse(response);
  console.log(LoadMoreItemsResponse.fromJson(responseJson));
  console.log("\n");
}

async function getfollowerscount() {
  const token = new AuthToken("12345", 10);
  const user = new User(
    "Allen",
    "Anderson",
    "@allen",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  );
  const req = new GetFollowCountRequest("", token, user, "followees");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await getFollowHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(GetFollowCountResponse.fromJson(responseJson));
  console.log("\n");
}

async function loadmoreusers() {
  const token = new AuthToken("12345", 10);
  const user = new User(
    "Allen",
    "Anderson",
    "@allen",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  );
  const user_2 = new User(
    "Amy",
    "Ames",
    "@amy",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  );
  const req = new LoadMoreUsersRequest("", token, user, user_2, 5, "followers");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await loadMoreUsersHandler(req));
  // console.log(response);
  let responseJson = JSON.parse(response);
  // console.log(responseJson);
  console.log(LoadMoreUsersResponse.fromJson(responseJson));
  console.log("\n");
}

async function test_user_dao() {
  const dao = new DynamoUserDAO();
  const user = await dao.getUser("@r");
  console.log(user);

  // const user_2 = new User("abbie", "sinema", "@ab", "/image/url/abbie");
  // const put = await dao.putUser(user_2);
  // console.log(put);

  // const put_2 = await dao.putUser(user_2);
  // console.log(put_2);
}

async function test_auth_dao() {
  const dao = new DynamoAuthenticationDAO();
  const username = "r";
  const password = "password";

  const valid = await dao.getPassword(username);
  console.log(valid);
}

async function test_token_dao() {
  const dao = new DynamoAuthTokenDAO();
  let token = AuthToken.Generate();
  console.log(token);
  token.timestamp = token.timestamp - 6000000;
  console.log(token);

  await dao.putAuthToken(token, "");

  const token_2 = await dao.checkAuthToken(token);
  console.log(token_2);
}

async function test_follow() {
  const dao = new DynamoFollowDAO();
  // const dao_2 = new DynamoUserDAO();
  const follower = new User("r", "s", "@riley", "image/url");
  const followee = new User("a", "s", "@abbie", "image/url");
  // const put = await dao_2.putUser(followee);

  await dao.putFollow(new Follow(follower, followee));
  const status = await dao.getFollow(new Follow(follower, followee));
  console.log(status);
}

async function test_get_follow_count() {
  const dao = new DynamoFollowDAO();
  const token = AuthToken.Generate();
  const authDAO = new DynamoAuthTokenDAO();
  const user = new User("a", "a", "@riley", "imag");
  await new DynamoUserDAO().putUser(user);
  await authDAO.putAuthToken(token, user.alias);
  const user_2 = new User("a", "a", "@abbie", "imag");
  await new DynamoUserDAO().putUser(user_2);

  const service = new UserService(new DynamoDAOFactory());

  const [ab_followers, ab_followees] = await service.follow(token, user_2);

  console.log(ab_followers, ab_followees);
}

async function test_login_logout() {
  let req = new LoginRequest("r", "password");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await loginHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(AuthenticateResponse.fromJson(responseJson));
  console.log("\n");

  let req_2 = new TweeterRequest(
    "@r",
    AuthenticateResponse.fromJson(responseJson).token
    // new AuthToken("token", 10)
  );
  console.log(JSON.stringify(req_2));
  let response_2 = JSON.stringify(await logoutHandler(req_2));
  console.log(response_2);
  let responseJson_2 = JSON.parse(response_2);
  console.log(TweeterResponse.fromJson(responseJson_2));
  console.log("\n");
}

async function put_user() {
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
    const user = new User(
      nameList[Math.floor(Math.random() * nameList.length)],
      lastNameList[Math.floor(Math.random() * lastNameList.length)],
      "@user_" + String(i),
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );

    const dao = new DynamoUserDAO();
    const put = await dao.putUser(user);
  }
}

async function delete_follow() {
  let req = new LoginRequest("abley", "password");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await loginHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  const auth_resp = AuthenticateResponse.fromJson(responseJson);
  console.log(auth_resp);
  console.log("\n");

  const followee = new User(
    "Allen",
    "Anderson",
    "@allen",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  );

  let uf_req = new FollowRequest(
    auth_resp.user.alias,
    auth_resp.token,
    followee
  );
  console.log(JSON.stringify(uf_req));
  let uf_response = JSON.stringify(await followHandler(uf_req));
  console.log(uf_response);
  let un_responseJson = JSON.parse(uf_response);
  console.log(FollowResponse.fromJson(un_responseJson));
  console.log("\n");
}

async function test_load_more_followers() {
  const token = new AuthToken("token", 10);
  const user = new User(
    "Allen",
    "Anderson",
    "@allen",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  );
  const req = new LoadMoreUsersRequest("", token, user, null, 5, "followers");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await loadMoreUsersHandler(req));
  // console.log(response);
  let responseJson = JSON.parse(response);
  // console.log(responseJson);
  console.log(LoadMoreUsersResponse.fromJson(responseJson));
  console.log("\n");
}

async function test_post_with_feed_attatched() {
  let req = new LoginRequest("abley", "password");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await loginHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  const auth_resp = AuthenticateResponse.fromJson(responseJson);
  console.log(auth_resp);
  console.log("\n");

  const post = new Status(
    "trying feed capabilities",
    auth_resp.user,
    Date.now()
  );

  const req_2 = new PostStatusRequest("", auth_resp.token, post);
  console.log(JSON.stringify(req_2));
  const response_2 = JSON.stringify(await postStatusHandler(req_2));
  console.log(response_2);
  const responseJson_2 = JSON.parse(response_2);
  console.log(TweeterResponse.fromJson(responseJson_2));
  console.log("\n");
}

async function test_get_page_status() {
  const statusDAO = new DynamoStatusDAO();
  const userDAO = new DynamoUserDAO();

  const user = new User("a", "a", "@abley", "image");

  const [alias_timestamps, hasMorePages] = await statusDAO.getPageOfStatus(
    user.alias,
    5,
    undefined
  );

  let statusList: Status[] = [];

  for (let i = 0; i < alias_timestamps.length; i++) {
    let user = await userDAO.getUser(alias_timestamps[i][0]);

    if (!!user) {
      let status = await statusDAO.getStatus(
        alias_timestamps[i][0],
        alias_timestamps[i][1],
        user
      );
      if (!!status) {
        statusList.push(status);
      }
    }
  }

  console.log(statusList);
}

async function put_follows() {
  const followee = new User("riley", "sinema", "@riley", "image");
  for (let i = 0; i < 20; i++) {
    const follower = new User(
      "a",
      "a",
      "@user_" + String(i),
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );

    const dao = new DynamoFollowDAO();
    const put = await dao.putFollow(new Follow(follower, followee));
  }
}

async function put_batch_feed() {
  const dao = new DynamoFeedDAO();
  const service = new StatusService(new DynamoDAOFactory());
  const user = new User("a", "a", "@riley", "image");
  const status = new Status("test_post", user, 10);
  const aliasList: string[] = [];
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

  const jsonObj = JSON.parse(
    JSON.stringify({ ["aliasList"]: aliasList, ["status"]: status })
  );

  console.log(jsonObj.aliasList.length);

  postUpdateFeedMessageHandler(event);

  // updateFeedHandler(event);
}

async function test() {
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
  await put_batch_feed();
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
}

test();

// dist % zip -r ../dist.zip *

// cp -rL node_modules nodejs

// zip -r nodejs.zip nodejs
