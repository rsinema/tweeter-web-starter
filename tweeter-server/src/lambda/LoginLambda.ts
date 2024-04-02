import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
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
  if (event.alias === null || event.password === null) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;
  try {
    response = new AuthenticateResponse(
      true,
      ...(await new UserService(new DynamoDAOFactory()).login(
        event.alias,
        event.password
      )),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }
  return response;
};
