import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { StatusService } from "../model/service/StatusService";
import {
  AuthToken,
  PostStatusRequest,
  Status,
  TweeterResponse,
} from "tweeter-shared";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

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

  const sqs_url =
    "https://sqs.us-west-2.amazonaws.com/710560088359/PostStatusQueue";
  const sqsClient = new SQSClient();

  const params = {
    DelaySeconds: 10,
    MessageBody: JSON.stringify(status),
    QueueUrl: sqs_url,
  };

  try {
    await new StatusService(new DynamoDAOFactory()).postStatus(token!, status!);
    response = new TweeterResponse(true, null);
  } catch (error) {
    throw new Error(`[Database Error] ${(error as Error).message}`);
  }
  await sqsClient.send(new SendMessageCommand(params));
  return response;
};
