import { FollowService } from "../model/service/FollowService";
import { LoadMoreUsersRequest, LoadMoreUsersResponse } from "tweeter-shared";

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
  try {
    if (event.type === "followers") {
      response = new LoadMoreUsersResponse(
        true,
        ...(await new FollowService().loadMoreFollowers(
          event.authtoken,
          event.displayedUser,
          event.pageSize,
          event.lastItem
        )),
        null
      );
      return response;
    } else {
      response = new LoadMoreUsersResponse(
        true,
        ...(await new FollowService().loadMoreFollowees(
          event.authtoken,
          event.displayedUser,
          event.pageSize,
          event.lastItem
        )),
        null
      );
    }
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
