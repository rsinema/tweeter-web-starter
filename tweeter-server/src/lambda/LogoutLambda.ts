import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { UserService } from "../model/service/UserService";
import { TweeterResponse, TweeterRequest, AuthToken } from "tweeter-shared";

export const handler = async (
  event: TweeterRequest
): Promise<TweeterResponse> => {
  if (event.authtoken === undefined) {
    throw new Error("[Bad Request] Bad request");
  }
  let response = null;
  const token = AuthToken.fromJson(JSON.stringify(event.authtoken));
  try {
    await new UserService(new DynamoDAOFactory()).logout(token!);
    response = new TweeterResponse(true, null);
  } catch (error) {
    throw new Error(`[Database Error] ${(error as Error).message}`);
  }
  return response;
};
