import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status } from "tweeter-shared";
import { FeedDAO } from "../DAOInterface";

export class DynamoFeedDAO implements FeedDAO {
  readonly tableName = "feed";
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

  async putBatchOfFeedItems(aliasList: string[], status: Status) {
    if (aliasList.length == 0) {
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.generateBatchOfFeedItemRequests(
            aliasList,
            status
          ),
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

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    if (resp.UnprocessedItems != undefined) {
      let sec = 0.01;
      while (Object.keys(resp.UnprocessedItems).length > 0) {
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

  private generateBatchOfFeedItemRequests(aliasList: string[], status: Status) {
    return aliasList.map((alias) =>
      this.generateFeedItemRequest(alias, status)
    );
  }

  private generateFeedItemRequest(alias: string, status: Status) {
    let item = this.generateFeedItem(alias, status);
    let request = {
      PutRequest: {
        Item: item,
      },
    };
    return request;
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
function execSync(arg0: string) {
  throw new Error("Function not implemented.");
}
