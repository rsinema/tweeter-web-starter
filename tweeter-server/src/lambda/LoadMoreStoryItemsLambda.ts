import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { StatusService } from "../model/service/StatusService";
import {
  AuthToken,
  LoadMoreItemsRequest,
  LoadMoreItemsResponse,
  Status,
  User,
} from "tweeter-shared";

export const handler = async (
  event: LoadMoreItemsRequest
): Promise<LoadMoreItemsResponse> => {
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
  let lastItem = undefined;
  if (event.lastItem != null) {
    lastItem = Status.fromJson(JSON.stringify(event.lastItem));
  }
  try {
    response = new LoadMoreItemsResponse(
      true,
      ...(await new StatusService(new DynamoDAOFactory()).loadMoreStoryItems(
        token!,
        displayedUser!,
        event.pageSize,
        lastItem!
      )),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${(error as Error).message}`);
  }
  return response;
};
