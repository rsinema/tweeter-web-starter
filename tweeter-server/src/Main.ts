import {
  AuthToken,
  AuthenticateResponse,
  FollowRequest,
  FollowResponse,
  FollowStatusRequest,
  FollowStatusResponse,
  GetUserResponse,
  LoginRequest,
  RegisterRequest,
  TweeterRequest,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { handler as loginHandler } from "./lambda/LoginLambda";
import { handler as registerHandler } from "./lambda/RegisterLambda";
import { handler as followHandler } from "./lambda/FollowLambda";
import { handler as unfollowHandler } from "./lambda/UnfollowLambda";
import { handler as logoutHandler } from "./lambda/LogoutLambda";
import { handler as getUserHandler } from "./lambda/GetUserLambda";
import { handler as followStatusHandler } from "./lambda/FollowStatusLambda";

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

async function test() {
  await login();
  await register();
  await logout();
  await follow();
  await unfollow();
  await getuser();
  await getfollowstatus();
}

test();

// dist % zip -r ../dist.zip *

// cp -rL node_modules nodejs

// zip -r nodejs.zip nodejs
