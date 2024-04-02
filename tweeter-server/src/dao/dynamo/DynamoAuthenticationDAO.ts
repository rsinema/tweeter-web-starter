import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
import { AuthenticationDAO } from "../DAOInterface";

export class DynamoAuthenticationDAO implements AuthenticationDAO {
  readonly tableName = "authentication";
  readonly usernameAttr = "username";
  readonly passwordAttr = "password";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async authenticate(username: string, password: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.usernameAttr]: username,
      },
    };
    const output = await this.client.send(new GetCommand(params));

    if (output === undefined) {
      return false;
    }

    console.log(output.Item!.password);
    if (password === output.Item!.password) {
      return true;
    } else {
      return false;
    }
  }

  async putAuthentication(username: string, password: string) {
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
