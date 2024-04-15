import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { FollowService } from "../model/service/FollowService";
import { PostSegment, Status, User } from "tweeter-shared";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { UserService } from "../model/service/UserService";

export const handler = async (event: any): Promise<void> => {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];

    const service = new FollowService(new DynamoDAOFactory());

    // extract the alias and the status from the body
    const parsed_body = JSON.parse(body);
    const status = Status.fromJson(JSON.stringify(parsed_body));
    const user = status?.user;

    let aliasList: string[] = [];

    // get a page of follower aliases
    aliasList = await service.getFollowers(user!);
    const sqs_url =
      "https://sqs.us-west-2.amazonaws.com/710560088359/UpdateFeedQueue";
    const sqsClient = new SQSClient();

    const params = {
      MessageBody: createItem(aliasList, status!),
      QueueUrl: sqs_url,
    };

    await sqsClient.send(new SendMessageCommand(params));
  }
};

function createItem(aliasList: string[], status: Status) {
  return JSON.stringify({ ["aliasList"]: aliasList, ["status"]: status });
}
