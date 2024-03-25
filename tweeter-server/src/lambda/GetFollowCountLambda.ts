import { UserService } from "../model/service/UserService";
import {
  AuthToken,
  GetFollowCountResponse,
  GetFollowCountRequest,
  User,
} from "tweeter-shared";

export const handler = async (
  event: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  if (
    event.alias === null ||
    event.authtoken === null ||
    event.authtoken === undefined
  ) {
    throw new Error("[Bad Request] Bad request");
  }

  let response = null;
  try {
    if (event.type === "followers") {
      response = new GetFollowCountResponse(
        true,
        await new UserService().getFollowersCount(event.authtoken, event.user),
        null
      );
    } else {
      response = new GetFollowCountResponse(
        true,
        await new UserService().getFolloweesCount(event.authtoken, event.user),
        null
      );
    }
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
