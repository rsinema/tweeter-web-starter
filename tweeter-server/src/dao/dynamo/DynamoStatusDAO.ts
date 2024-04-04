import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, User } from "tweeter-shared";
import { StatusDAO } from "../DAOInterface";

export class DynamoStatusDAO implements StatusDAO {
  readonly tableName = "status";
  readonly aliasAttr = "alias";
  readonly postAttr = "post";
  readonly timestampAttr = "timestamp";
  readonly formattedDateAttr = "date";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putStatus(status: Status): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateStatusItem(status),
    };

    await this.client.send(new PutCommand(params));
  }

  async getPageOfStatus(
    alias: string,
    pageSize: number,
    lastItem: Status | undefined
  ): Promise<[[string, number][], boolean]> {
    const params = {
      KeyConditionExpression: this.aliasAttr + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.aliasAttr]: lastItem.user.alias,
              [this.timestampAttr]: lastItem.timestamp,
            },
    };

    const items: [string, number][] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push([item[this.aliasAttr], item[this.timestampAttr]])
    );
    return [items, hasMorePages];
  }

  async getStatus(
    alias: string,
    timestamp: number,
    user: User
  ): Promise<Status | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
        [this.timestampAttr]: timestamp,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new Status(output.Item.post, user, output.Item.timestamp);
  }

  private generateStatusItem(status: Status) {
    return {
      [this.aliasAttr]: status.user.alias,
      [this.postAttr]: status.post,
      [this.timestampAttr]: status.timestamp,
      [this.formattedDateAttr]: status.formattedDate,
    };
  }
}
