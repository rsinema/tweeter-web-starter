import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
import { UserDAO } from "../DAOInterface";

export class DynamoUserDAO implements UserDAO {
  readonly tableName = "users";
  readonly aliasAttr = "alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageUrlAttr = "image_url";
  readonly followersAttr = "followers";
  readonly followeesAttr = "followees";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getUser(alias: string): Promise<User | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new User(
          output.Item.first_name,
          output.Item.last_name,
          output.Item.alias,
          output.Item.image_url
        );
  }

  async putUser(user: User): Promise<boolean> {
    if ((await this.getUser(user.alias)) !== undefined) {
      return false;
    }

    const params = {
      TableName: this.tableName,
      Item: this.generateUserItem(user),
    };

    await this.client.send(new PutCommand(params));

    return true;
  }

  async deleteUser(alias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getFolloweesCount(alias: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
    };
    const output = await this.client.send(new GetCommand(params));

    return output.Item?.followees;
  }

  async getFollowersCount(alias: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
    };
    const output = await this.client.send(new GetCommand(params));

    return output.Item?.followers;
  }

  async updateFolloweesCount(alias: string, value: number) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
      UpdateExpression:
        "set " + this.followeesAttr + " = " + this.followeesAttr + " + :inc",
      ExpressionAttributeValues: {
        ":inc": value,
      },
    };

    await this.client.send(new UpdateCommand(params));
  }

  async updateFollowersCount(alias: string, value: number) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
      UpdateExpression:
        "set " + this.followersAttr + " = " + this.followersAttr + " + :inc",
      ExpressionAttributeValues: {
        ":inc": value,
      },
    };

    await this.client.send(new UpdateCommand(params));
  }

  private generateUserItem(user: User) {
    return {
      [this.aliasAttr]: user.alias,
      [this.firstNameAttr]: user.firstName,
      [this.lastNameAttr]: user.lastName,
      [this.imageUrlAttr]: user.imageUrl,
      [this.followersAttr]: 0,
      [this.followeesAttr]: 0,
    };
  }
}
