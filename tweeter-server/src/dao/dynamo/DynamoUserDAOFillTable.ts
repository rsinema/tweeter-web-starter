import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { execSync } from "child_process";
import { User } from "tweeter-shared";

export class DynamoUserDAOFillTable {
  readonly tableName = "users";
  readonly aliasAttr = "alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageUrlAttr = "image_url";
  readonly followersAttr = "followers";
  readonly followeesAttr = "followees";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createUsers(userList: User[]) {
    if (userList.length == 0) {
      console.log("zero followers to batch write");
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.createPutUserRequestItems(userList),
        },
      };
      await this.client
        .send(new BatchWriteCommand(params))
        .then(async (resp: BatchWriteCommandOutput) => {
          await this.putUnprocessedItems(resp, params);
        })
        .catch((err: string) => {
          throw new Error(
            "Error while batchwriting users with params: " +
              params +
              ": \n" +
              err
          );
        });
    }
  }
  private createPutUserRequestItems(userList: User[]) {
    return userList.map((user) => this.createPutUserRequest(user));
  }
  private createPutUserRequest(user: User) {
    let item = {
      [this.aliasAttr]: user.alias,
      [this.firstNameAttr]: user.firstName,
      [this.lastNameAttr]: user.lastName,
      [this.imageUrlAttr]: user.imageUrl,
      [this.followersAttr]: 0,
      [this.followeesAttr]: 1,
    };
    let request = {
      PutRequest: {
        Item: item,
      },
    };
    return request;
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    if (resp.UnprocessedItems != undefined) {
      let sec = 0.01;
      while (Object.keys(resp.UnprocessedItems).length > 0) {
        console.log(
          Object.keys(resp.UnprocessedItems.feed).length + " unprocessed items"
        );
        //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
        // @ts-ignore
        params.RequestItems = resp.UnprocessedItems;
        execSync("sleep " + sec);
        if (sec < 1) sec += 0.1;
        await this.client.send(new BatchWriteCommand(params));
        if (resp.UnprocessedItems == undefined) {
          break;
        }
      }
    }
  }
  increaseFollowersCount(alias: string, count: number) {
    const params = {
      TableName: this.tableName,
      Key: { [this.aliasAttr]: alias },
      ExpressionAttributeValues: { ":inc": count },
      UpdateExpression:
        "SET " + this.followersAttr + " = " + this.followersAttr + " + :inc",
    };
    this.client.send(new UpdateCommand(params)).then((data) => {
      return true;
    });
  }
}
