import { UserService } from "../model/service/UserService";
import { TweeterResponse, TweeterRequest } from "tweeter-shared";

export const handler = async (
  event: TweeterRequest
): Promise<TweeterResponse> => {
  if (event.authtoken === undefined) {
    return new TweeterResponse(false, "Bad Request");
  }

  await new UserService().logout(event.authtoken!);
  let response = new TweeterResponse(true, null);
  return response;
};
