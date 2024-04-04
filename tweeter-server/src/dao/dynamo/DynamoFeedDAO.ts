import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status } from "tweeter-shared";
import { FeedDAO } from "../DAOInterface";

export class DynamoFeedDAO implements FeedDAO {
  readonly tableName = "feed";
  readonly indexName = "followee_index";
  readonly aliasAttr = "alias";
  readonly followeeAliasAttribute = "followee_alias";
  readonly postAttr = "post";
  readonly timestampAttr = "timestamp";
  readonly formattedDateAttr = "date";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putFeedItem(feedOwnerAlias: string, status: Status): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateFeedItem(feedOwnerAlias, status),
    };

    await this.client.send(new PutCommand(params));
  }

  async getPageOfFeed(
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
              [this.followeeAliasAttribute]: lastItem.user.alias,
              [this.timestampAttr]: lastItem.timestamp,
            },
    };

    const items: [string, number][] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push([item[this.followeeAliasAttribute], item[this.timestampAttr]])
    );
    return [items, hasMorePages];
  }

  private generateFeedItem(feedOwnerAlias: string, status: Status) {
    return {
      [this.aliasAttr]: feedOwnerAlias,
      [this.followeeAliasAttribute]: status.user.alias,
      [this.postAttr]: status.post,
      [this.timestampAttr]: status.timestamp,
      [this.formattedDateAttr]: status.formattedDate,
    };
  }
}
