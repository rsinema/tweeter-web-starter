"use strict";
// import { FollowService } from "../model/service/FollowService";
// import { LoadMoreItemsRequest, LoadMoreItemsResponse } from "tweeter-shared";
// export const handler = async (
//   event: LoadMoreItemsRequest
// ): Promise<LoadMoreItemsResponse> => {
//   if (event.authtoken === undefined || event.alias === undefined) {
//     return new LoadMoreItemsResponse(false, [], false, "Bad Request");
//   }
//   let response = new LoadMoreItemsResponse(
//     true,
//     ...(await new FollowService().loadMoreFollowers(
//       event.authtoken,
//       event.displayedUser,
//       event.pageSize,
//       event.lastItem
//     )),
//     null
//   );
//   return response;
// };
