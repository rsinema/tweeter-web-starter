import { UserService } from "../model/service/UserService";
import {
  AuthToken,
  AuthenticateResponse,
  LoginRequest,
  TweeterResponse,
  User,
} from "tweeter-shared";

export const handler = async (
  event: LoginRequest
): Promise<AuthenticateResponse> => {
  if (event.alias === undefined || event.password === undefined) {
    return new AuthenticateResponse(
      false,
      new User("", "", "", ""),
      new AuthToken("", 0),
      "Bad Request"
    );
  }

  let response = new AuthenticateResponse(
    true,
    ...(await new UserService().login(event.alias, event.password)),
    null
  );
  return response;
};
