import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { UserService } from "../model/service/UserService";
import { GetUserResponse, TweeterRequest, User } from "tweeter-shared";

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
  try {
    response = new GetUserResponse(
      true,
      await new UserService(new DynamoDAOFactory()).getUser(
        event.authtoken,
        event.alias
      ),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
