import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../DAOInterface";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
  readonly tableName = "authtokens";
  readonly authtokenAttr = "authtoken";
  readonly timestampAttr = "timestamp";
  readonly userAliasAttr = "user_alias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async checkAuthToken(
    token: AuthToken
  ): Promise<[AuthToken, string] | [undefined, undefined]> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.authtokenAttr]: token.token,
      },
    };

    const output = await this.client.send(new GetCommand(params));

    if (output.Item === undefined) {
      return [undefined, undefined];
    }

    const curr_time = Date.now();
    const minutesElapsed = (curr_time - output.Item!.timestamp) / 60000;
    // console.log(minutesElapsed);
    token.timestamp = curr_time;

    if (minutesElapsed < 60) {
      this.putAuthToken(token, output.Item.user_alias);
      return [token, output.Item.user_alias];
    } else {
      this.deleteAuthToken(token);
      return [undefined, undefined];
    }
  }

  async putAuthToken(token: AuthToken, alias: string) {
    const params = {
      TableName: this.tableName,
      Item: this.generateAuthTokenItem(token, alias),
    };

    await this.client.send(new PutCommand(params));
  }

  async deleteAuthToken(token: AuthToken): Promise<void> {
    console.log(token);

    const params = {
      TableName: this.tableName,
      Key: {
        [this.authtokenAttr]: token.token,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateAuthTokenItem(token: AuthToken, alias: string) {
    return {
      [this.authtokenAttr]: token.token,
      [this.timestampAttr]: token.timestamp,
      [this.userAliasAttr]: alias,
    };
  }
}
