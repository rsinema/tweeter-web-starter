import { UserService } from "../model/service/UserService";
import { FollowStatusResponse, FollowStatusRequest } from "tweeter-shared";

export const handler = async (
  event: FollowStatusRequest
): Promise<FollowStatusResponse> => {
  if (
    event.authtoken === null ||
    event.authtoken === undefined ||
    event.user === null ||
    event.selectedUser == null
  ) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;

  try {
    response = new FollowStatusResponse(
      true,
      await new UserService().getIsFollowerStatus(
        event.authtoken,
        event.user,
        event.selectedUser
      ),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
