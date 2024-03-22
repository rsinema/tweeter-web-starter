import { LoginRequest } from "tweeter-shared";
import { handler } from "./lambda/LoginLambda";

testLogin();

async function testLogin() {
  let req = new LoginRequest("a", "a");
  console.log(JSON.stringify(req));
  console.log(await handler(req));
}
