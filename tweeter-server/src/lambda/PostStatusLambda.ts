import { StatusService } from "../model/service/StatusService";
import { PostStatusRequest, TweeterResponse, User } from "tweeter-shared";

export const handler = async (
  event: PostStatusRequest
): Promise<TweeterResponse> => {
  if (
    event.authtoken === undefined ||
    event.authtoken === null ||
    event.alias === null
  ) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;

  try {
    await new StatusService().postStatus(event.authtoken, event.status);
    response = new TweeterResponse(true, null);
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }
  return response;
};
