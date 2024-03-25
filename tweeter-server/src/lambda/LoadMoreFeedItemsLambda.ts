import { StatusService } from "../model/service/StatusService";
import { LoadMoreItemsRequest, LoadMoreItemsResponse } from "tweeter-shared";

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
  try {
    response = new LoadMoreItemsResponse(
      true,
      ...(await new StatusService().loadMoreFeedItems(
        event.authtoken,
        event.displayedUser,
        event.pageSize,
        event.lastItem
      )),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
