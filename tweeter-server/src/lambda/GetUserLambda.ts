import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { UserService } from "../model/service/UserService";
import {
  AuthToken,
  GetUserResponse,
  TweeterRequest,
  User,
} from "tweeter-shared";

export const handler = async (
  event: TweeterRequest
): Promise<GetUserResponse> => {
  if (
    event.authtoken === undefined ||
    event.alias === null ||
    event.authtoken == null
  ) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;
  const token = AuthToken.fromJson(JSON.stringify(event.authtoken));
  try {
    response = new GetUserResponse(
      true,
      await new UserService(new DynamoDAOFactory()).getUser(
        token!,
        event.alias
      ),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${(error as Error).message}`);
  }

  return response;
};
