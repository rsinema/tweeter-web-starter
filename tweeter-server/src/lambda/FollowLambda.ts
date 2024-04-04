import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { UserService } from "../model/service/UserService";
import { FollowResponse, FollowRequest, User, AuthToken } from "tweeter-shared";

export const handler = async (
  event: FollowRequest
): Promise<FollowResponse> => {
  if (
    event.authtoken === null ||
    event.authtoken === undefined ||
    event.userToFollow === null
  ) {
    throw new Error("[Bad Request] Bad request");
  }
  let response = null;
  const user = User.fromJson(JSON.stringify(event.userToFollow));
  const token = AuthToken.fromJson(JSON.stringify(event.authtoken));
  try {
    response = new FollowResponse(
      true,
      ...(await new UserService(new DynamoDAOFactory()).follow(token!, user!)),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
