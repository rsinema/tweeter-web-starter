import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { StatusService } from "../model/service/StatusService";
import {
  AuthToken,
  PostStatusRequest,
  Status,
  TweeterResponse,
} from "tweeter-shared";

export const handler = async (event: any): Promise<void> => {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    console.log(body);
    // extract the alias and the status from the body
    // get a page of follower aliases
    // create and place a request into the SQS update feed queue
  }
};
