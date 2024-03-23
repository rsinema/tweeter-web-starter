import { UserService } from "../model/service/UserService";
import {
  AuthToken,
  AuthenticateResponse,
  RegisterRequest,
  User,
} from "tweeter-shared";

export const handler = async (
  event: RegisterRequest
): Promise<AuthenticateResponse> => {
  if (
    event.firstName === undefined ||
    event.lastName === undefined ||
    event.alias === undefined ||
    event.password === undefined ||
    event.userImageBase64String === undefined
  ) {
    return new AuthenticateResponse(
      false,
      new User("", "", "", ""),
      new AuthToken("", 0),
      "Bad Request"
    );
  }

  let response = new AuthenticateResponse(
    true,
    ...(await new UserService().register(
      event.firstName,
      event.lastName,
      event.alias,
      event.password,
      event.userImageBase64String
    )),
    null
  );
  return response;
};
