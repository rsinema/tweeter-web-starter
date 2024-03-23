import { UserService } from "../model/service/UserService";
import { FollowStatusResponse, FollowStatusRequest } from "tweeter-shared";

export const handler = async (
  event: FollowStatusRequest
): Promise<FollowStatusResponse> => {
  if (
    event.authtoken === undefined ||
    event.user === undefined ||
    event.selectedUser == undefined
  ) {
    return new FollowStatusResponse(false, false, "Bad Request");
  }

  let response = new FollowStatusResponse(
    true,
    await new UserService().getIsFollowerStatus(
      event.authtoken,
      event.user,
      event.selectedUser
    ),
    null
  );
  return response;
};
