import { UserService } from "../model/service/UserService";
import { GetUserResponse, TweeterRequest, User } from "tweeter-shared";

export const handler = async (
  event: TweeterRequest
): Promise<GetUserResponse> => {
  if (event.authtoken === undefined || event.alias === undefined) {
    return new GetUserResponse(false, new User("", "", "", ""), "Bad Request");
  }

  let response = new GetUserResponse(
    true,
    await new UserService().getUser(event.authtoken, event.alias),
    null
  );
  return response;
};
