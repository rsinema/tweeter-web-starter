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

class DynamoUserDAOClearTable {
  readonly tableName = "users";
  readonly aliasAttr = "alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageUrlAttr = "image_url";
  readonly followersAttr = "followers";
  readonly followeesAttr = "followees";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async deleteUsers(userList: User[]) {
    if (userList.length == 0) {
      console.log("zero followers to batch write");
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.createDeleteUserRequestItems(userList),
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
  private createDeleteUserRequestItems(userList: User[]) {
    return userList.map((user) => this.createDeleteUserRequest(user));
  }
  private createDeleteUserRequest(user: User) {
    let item = {
      [this.aliasAttr]: user.alias,
    };
    let request = {
      DeleteRequest: {
        Key: item,
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
      ExpressionAttributeValues: { ":inc": -count },
      UpdateExpression:
        "SET " + this.followersAttr + " = " + this.followersAttr + " + :inc",
    };
    this.client.send(new UpdateCommand(params)).then((data) => {
      return true;
    });
  }
}

class DynamoFollowDAOClearTable {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followersHandleAttr = "follower_handle";
  readonly followeesHandleAttr = "followee_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async deleteFollows(followeeAlias: string, followerAliasList: string[]) {
    if (followerAliasList.length == 0) {
      console.log("zero followers to batch write");
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.createDeleteFollowRequestItems(
            followeeAlias,
            followerAliasList
          ),
        },
      };
      await this.client
        .send(new BatchWriteCommand(params))
        .then(async (resp) => {
          await this.putUnprocessedItems(resp, params, 0);
          return;
        })
        .catch((err) => {
          throw new Error(
            "Error while batchwriting follows with params: " +
              params +
              ": \n" +
              err
          );
        });
    }
  }
  private createDeleteFollowRequestItems(
    followeeAlias: string,
    followerAliasList: string[]
  ) {
    let follwerAliasList = followerAliasList.map((followerAlias) =>
      this.createDeleteFollowRequest(followerAlias, followeeAlias)
    );
    return follwerAliasList;
  }
  private createDeleteFollowRequest(
    followerAlias: string,
    followeeAlias: string
  ) {
    let item = {
      [this.followersHandleAttr]: followerAlias,
      [this.followeesHandleAttr]: followeeAlias,
    };
    let request = {
      DeleteRequest: {
        Key: item,
      },
    };
    return request;
  }
  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput,
    attempts: number
  ) {
    if (attempts > 1) console.log(attempts + "th attempt starting");
    if (resp.UnprocessedItems != undefined) {
      let sec = 0.03;
      if (Object.keys(resp.UnprocessedItems).length > 0) {
        console.log(
          Object.keys(resp.UnprocessedItems[this.tableName]).length +
            " unprocessed items"
        );
        //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
        // @ts-ignore
        params.RequestItems = resp.UnprocessedItems;
        execSync("sleep " + sec);
        if (sec < 10) sec += 0.1;
        await this.client
          .send(new BatchWriteCommand(params))
          .then(async (innerResp) => {
            if (
              innerResp.UnprocessedItems != undefined &&
              Object.keys(innerResp.UnprocessedItems).length > 0
            ) {
              params.RequestItems = innerResp.UnprocessedItems;
              ++attempts;
              await this.putUnprocessedItems(innerResp, params, attempts);
            }
          })
          .catch((err) => {
            console.log("error while batch writing unprocessed items " + err);
          });
      }
    }
  }
}

const deleteFollow = new DynamoFollowDAOClearTable();
const deleteUserDAO = new DynamoUserDAOClearTable();

let followername = "@user_";
let mainUsername = "@riley";
let imageUrl =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "hello";
let lastName = "world";
let numUsers = 10000;
let batchSize = 25;
let aliasList: string[] = Array.from(
  { length: numUsers },
  (_, i) => followername + (i + 1)
);

function deleteFollowers(i: number) {
  if (i >= numUsers) return;
  else if (i % 1000 == 0) {
    console.log(i + " followers");
  }
  let followList = aliasList.slice(i, i + batchSize);
  deleteFollow
    .deleteFollows(mainUsername, followList)
    .then(() => deleteFollowers(i + batchSize))
    .catch((err) => console.log("error while deleting followers: " + err));
}

function createUserList(i: number) {
  let users: User[] = [];
  let limit = i + batchSize;
  for (let j = i; j < limit; ++j) {
    let user = new User(
      firstName + j,
      lastName + j,
      followername + j,
      imageUrl
    );
    users.push(user);
  }
  return users;
}

function deleteUsers(i: number) {
  if (i >= numUsers) return;
  else if (i % 1000 == 0) {
    console.log(i + " users");
  }
  let userList = createUserList(i);
  deleteUserDAO
    .deleteUsers(userList)
    .then(() => deleteUsers(i + batchSize))
    .catch((err) => console.log("error while setting users: " + err));
}

console.log("deleting follows");
deleteFollowers(0);
console.log("deleting users");
deleteUsers(0);
