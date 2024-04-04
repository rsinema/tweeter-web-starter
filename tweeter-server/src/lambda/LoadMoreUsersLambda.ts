import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { FollowService } from "../model/service/FollowService";
import {
  AuthToken,
  LoadMoreUsersRequest,
  LoadMoreUsersResponse,
  User,
} from "tweeter-shared";

export const handler = async (
  event: LoadMoreUsersRequest
): Promise<LoadMoreUsersResponse> => {
  if (
    event.authtoken === undefined ||
    event.alias === null ||
    event.authtoken === null ||
    event.pageSize === null
  ) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;
  const token = AuthToken.fromJson(JSON.stringify(event.authtoken));
  const displayedUser = User.fromJson(JSON.stringify(event.displayedUser));
  let lastItem = null;
  if (event.lastItem != null) {
    lastItem = User.fromJson(JSON.stringify(event.lastItem));
  }
  try {
    if (event.type === "followers") {
      response = new LoadMoreUsersResponse(
        true,
        ...(await new FollowService(new DynamoDAOFactory()).loadMoreFollowers(
          token!,
          displayedUser!,
          event.pageSize,
          lastItem!
        )),
        null
      );
      return response;
    } else {
      response = new LoadMoreUsersResponse(
        true,
        ...(await new FollowService(new DynamoDAOFactory()).loadMoreFollowees(
          token!,
          displayedUser!,
          event.pageSize,
          lastItem!
        )),
        null
      );
    }
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
