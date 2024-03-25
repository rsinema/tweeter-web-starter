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

async function login() {
  let req = new LoginRequest("a", "a");
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await loginHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(AuthenticateResponse.fromJson(responseJson));
  console.log("\n");
}

async function register() {
  let req = new RegisterRequest("a", "a", "a", "a", "image");
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
  const token = new AuthToken("12345", 10);
  const user = new User("first", "last", "a", "url");
  let req = new FollowRequest("a", token, user);
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
  const token = new AuthToken("12345", 10);
  let req = new TweeterRequest("@bob", token);
  console.log(JSON.stringify(req));
  let response = JSON.stringify(await getUserHandler(req));
  console.log(response);
  let responseJson = JSON.parse(response);
  console.log(GetUserResponse.fromJson(responseJson));
  console.log("\n");
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
  await loadmoreusers();
}

test();

// dist % zip -r ../dist.zip *

// cp -rL node_modules nodejs

// zip -r nodejs.zip nodejs
