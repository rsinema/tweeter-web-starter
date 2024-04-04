import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { UserService } from "../model/service/UserService";
import {
  FollowStatusResponse,
  FollowStatusRequest,
  AuthToken,
  User,
} from "tweeter-shared";

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
  const token = AuthToken.fromJson(JSON.stringify(event.authtoken));
  const user = User.fromJson(JSON.stringify(event.user));
  const selectedUser = User.fromJson(JSON.stringify(event.selectedUser));

  try {
    response = new FollowStatusResponse(
      true,
      await new UserService(new DynamoDAOFactory()).getIsFollowerStatus(
        token!,
        user!,
        selectedUser!
      ),
      null
    );
  } catch (error) {
    throw new Error(`[Database Error] ${error as Error}.message`);
  }

  return response;
};
