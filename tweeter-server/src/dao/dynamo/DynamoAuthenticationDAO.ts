import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthenticationDAO } from "../DAOInterface";

export class DynamoAuthenticationDAO implements AuthenticationDAO {
  readonly tableName = "authentication";
  readonly usernameAttr = "username";
  readonly passwordAttr = "password";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getPassword(username: string): Promise<string | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.usernameAttr]: username,
      },
    };
    const output = await this.client.send(new GetCommand(params));

    if (output === undefined) {
      return undefined;
    }

    return output.Item!.password;
  }

  async putAuthentication(username: string, password: string, salt: string) {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.usernameAttr]: username,
        [this.passwordAttr]: password,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async deleteAuthentication(username: string) {
    throw new Error("delete not implemented yet");
  }
}
