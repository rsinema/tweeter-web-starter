import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { UserService } from "../model/service/UserService";
import {
  AuthToken,
  GetFollowCountResponse,
  GetFollowCountRequest,
  User,
} from "tweeter-shared";

export const handler = async (
  event: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  if (
    event.alias === null ||
    event.authtoken === null ||
    event.authtoken === undefined
  ) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;
  const token = AuthToken.fromJson(JSON.stringify(event.authtoken));
  const user = User.fromJson(JSON.stringify(event.user));
  try {
    if (event.type === "followers") {
      response = new GetFollowCountResponse(
        true,
        await new UserService(new DynamoDAOFactory()).getFollowersCount(
          token!,
          user!
        ),
        null
      );
    } else {
      response = new GetFollowCountResponse(
        true,
        await new UserService(new DynamoDAOFactory()).getFolloweesCount(
          token!,
          user!
        ),
        null
      );
    }
  } catch (error) {
    throw new Error(`[Database Error] ${(error as Error).message}`);
  }

  return response;
};
