import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../dao/dynamo/DynamoDAOFactory";
import { Status } from "tweeter-shared";

export const handler = async (event: any): Promise<void> => {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];

    const service = new StatusService(new DynamoDAOFactory());

    const parsed_body = JSON.parse(body);
    const status = Status.fromJson(JSON.stringify(parsed_body.status));
    const aliasList = parsed_body.aliasList;

    if (aliasList.length > 0) {
      // let s = "";
      for (let i = 0; i < aliasList.length; i = i + 25) {
        let k = i + 25;
        if (k > aliasList.length) {
          k = aliasList.length;
        }
        let aliasBatch = [];
        for (let j = i; j < k; j++) {
          aliasBatch.push(aliasList[j]);
        }
        // s = s + " " + i;
        await service.postToFeed(aliasBatch, status!);
      }
      // console.log(s);
    } else {
      console.log("No followers to post feed to");
    }
  }
};
