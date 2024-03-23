import { UserService } from "../model/service/UserService";
import { FollowResponse, FollowRequest } from "tweeter-shared";

export const handler = async (
  event: FollowRequest
): Promise<FollowResponse> => {
  if (event.authtoken === undefined || event.userToFollow === undefined) {
    return new FollowResponse(false, 0, 0, "Bad Request");
  }

  let response = new FollowResponse(
    true,
    ...(await new UserService().follow(event.authtoken!, event.userToFollow)),
    null
  );
  return response;
};
