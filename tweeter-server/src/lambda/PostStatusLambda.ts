import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { StatusService } from "../model/service/StatusService";
import {
  AuthToken,
  PostStatusRequest,
  Status,
  TweeterResponse,
} from "tweeter-shared";

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

  const token = AuthToken.fromJson(JSON.stringify(event.authtoken));
  const status = Status.fromJson(JSON.stringify(event.status));

  try {
    await new StatusService(new DynamoDAOFactory()).postStatus(token!, status!);
    response = new TweeterResponse(true, null);
  } catch (error) {
    throw new Error(`[Database Error] ${(error as Error).message}`);
  }
  return response;
};
