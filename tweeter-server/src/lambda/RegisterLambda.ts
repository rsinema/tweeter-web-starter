import { UserService } from "../model/service/UserService";
import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";

export const handler = async (
  event: RegisterRequest
): Promise<AuthenticateResponse> => {
  if (
    event.firstName === null ||
    event.lastName === null ||
    event.alias === null ||
    event.password === null ||
    event.userImageBase64String === null
  ) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;

  try {
    response = new AuthenticateResponse(
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
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
