import { UserService } from "../model/service/UserService";
import { TweeterResponse, TweeterRequest } from "tweeter-shared";

export const handler = async (
  event: TweeterRequest
): Promise<TweeterResponse> => {
  if (event.authtoken === null) {
    throw new Error("[Bad Request] Bad request");
  }
  let response = null;
  try {
    await new UserService().logout(event.authtoken!);
    response = new TweeterResponse(true, null);
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }
  return response;
};
