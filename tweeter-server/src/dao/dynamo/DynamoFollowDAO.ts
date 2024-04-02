import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follow, User } from "tweeter-shared";
import { FollowDAO } from "../DAOInterface";

export class DynamoFollowDAO implements FollowDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followersHandleAttr = "follower_handle";
  readonly followeesHandleAttr = "followee_handle";
  readonly followersNameAttr = "follower_name";
  readonly followeesNameAttr = "followee_name";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followeesHandleAttr]: follow.followee.alias,
        [this.followeesNameAttr]: follow.followee.name,
        [this.followersHandleAttr]: follow.follower.alias,
        [this.followersNameAttr]: follow.follower.name,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async updateFollow(follow: Follow): Promise<void> {
    this.putFollow(follow);
  }

  public async getFollow(follow: Follow): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follow),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined ? false : true;
  }

  async deleteFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follow),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined = undefined
  ): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.followersHandleAttr + " = :follower",
      ExpressionAttributeValues: {
        ":follower": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followersHandleAttr]: followerHandle,
              [this.followeesHandleAttr]: lastFolloweeHandle,
            },
    };

    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item[this.followeesHandleAttr]));
    return [items, hasMorePages];
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined = undefined
  ): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.followeesHandleAttr + " = :followee",
      ExpressionAttributeValues: {
        ":followee": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followersHandleAttr]: lastFollowerHandle,
              [this.followeesHandleAttr]: followeeHandle,
            },
    };

    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item[this.followersHandleAttr]));
    return [items, hasMorePages];
  }

  private generateFollowItem(follow: Follow) {
    return {
      [this.followersHandleAttr]: follow.follower.alias,
      [this.followeesHandleAttr]: follow.followee.alias,
    };
  }
}
