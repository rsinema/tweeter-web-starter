"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const child_process_1 = require("child_process");
const tweeter_shared_1 = require("tweeter-shared");
class DynamoUserDAOClearTable {
    constructor() {
        this.tableName = "users";
        this.aliasAttr = "alias";
        this.firstNameAttr = "first_name";
        this.lastNameAttr = "last_name";
        this.imageUrlAttr = "image_url";
        this.followersAttr = "followers";
        this.followeesAttr = "followees";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    deleteUsers(userList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userList.length == 0) {
                console.log("zero followers to batch write");
                return;
            }
            else {
                const params = {
                    RequestItems: {
                        [this.tableName]: this.createDeleteUserRequestItems(userList),
                    },
                };
                yield this.client
                    .send(new lib_dynamodb_1.BatchWriteCommand(params))
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    yield this.putUnprocessedItems(resp, params);
                }))
                    .catch((err) => {
                    throw new Error("Error while batchwriting users with params: " +
                        params +
                        ": \n" +
                        err);
                });
            }
        });
    }
    createDeleteUserRequestItems(userList) {
        return userList.map((user) => this.createDeleteUserRequest(user));
    }
    createDeleteUserRequest(user) {
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
    putUnprocessedItems(resp, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resp.UnprocessedItems != undefined) {
                let sec = 0.01;
                while (Object.keys(resp.UnprocessedItems).length > 0) {
                    console.log(Object.keys(resp.UnprocessedItems.feed).length + " unprocessed items");
                    //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
                    // @ts-ignore
                    params.RequestItems = resp.UnprocessedItems;
                    (0, child_process_1.execSync)("sleep " + sec);
                    if (sec < 1)
                        sec += 0.1;
                    yield this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
                    if (resp.UnprocessedItems == undefined) {
                        break;
                    }
                }
            }
        });
    }
    increaseFollowersCount(alias, count) {
        const params = {
            TableName: this.tableName,
            Key: { [this.aliasAttr]: alias },
            ExpressionAttributeValues: { ":inc": -count },
            UpdateExpression: "SET " + this.followersAttr + " = " + this.followersAttr + " + :inc",
        };
        this.client.send(new lib_dynamodb_1.UpdateCommand(params)).then((data) => {
            return true;
        });
    }
}
class DynamoFollowDAOClearTable {
    constructor() {
        this.tableName = "follows";
        this.indexName = "follows_index";
        this.followersHandleAttr = "follower_handle";
        this.followeesHandleAttr = "followee_handle";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    deleteFollows(followeeAlias, followerAliasList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (followerAliasList.length == 0) {
                console.log("zero followers to batch write");
                return;
            }
            else {
                const params = {
                    RequestItems: {
                        [this.tableName]: this.createDeleteFollowRequestItems(followeeAlias, followerAliasList),
                    },
                };
                yield this.client
                    .send(new lib_dynamodb_1.BatchWriteCommand(params))
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    yield this.putUnprocessedItems(resp, params, 0);
                    return;
                }))
                    .catch((err) => {
                    throw new Error("Error while batchwriting follows with params: " +
                        params +
                        ": \n" +
                        err);
                });
            }
        });
    }
    createDeleteFollowRequestItems(followeeAlias, followerAliasList) {
        let follwerAliasList = followerAliasList.map((followerAlias) => this.createDeleteFollowRequest(followerAlias, followeeAlias));
        return follwerAliasList;
    }
    createDeleteFollowRequest(followerAlias, followeeAlias) {
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
    putUnprocessedItems(resp, params, attempts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (attempts > 1)
                console.log(attempts + "th attempt starting");
            if (resp.UnprocessedItems != undefined) {
                let sec = 0.03;
                if (Object.keys(resp.UnprocessedItems).length > 0) {
                    console.log(Object.keys(resp.UnprocessedItems[this.tableName]).length +
                        " unprocessed items");
                    //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
                    // @ts-ignore
                    params.RequestItems = resp.UnprocessedItems;
                    (0, child_process_1.execSync)("sleep " + sec);
                    if (sec < 10)
                        sec += 0.1;
                    yield this.client
                        .send(new lib_dynamodb_1.BatchWriteCommand(params))
                        .then((innerResp) => __awaiter(this, void 0, void 0, function* () {
                        if (innerResp.UnprocessedItems != undefined &&
                            Object.keys(innerResp.UnprocessedItems).length > 0) {
                            params.RequestItems = innerResp.UnprocessedItems;
                            ++attempts;
                            yield this.putUnprocessedItems(innerResp, params, attempts);
                        }
                    }))
                        .catch((err) => {
                        console.log("error while batch writing unprocessed items " + err);
                    });
                }
            }
        });
    }
}
const deleteFollow = new DynamoFollowDAOClearTable();
const deleteUserDAO = new DynamoUserDAOClearTable();
let followername = "@user_";
let mainUsername = "@riley";
let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "hello";
let lastName = "world";
let numUsers = 10000;
let batchSize = 25;
let aliasList = Array.from({ length: numUsers }, (_, i) => followername + (i + 1));
function deleteFollowers(i) {
    if (i >= numUsers)
        return;
    else if (i % 1000 == 0) {
        console.log(i + " followers");
    }
    let followList = aliasList.slice(i, i + batchSize);
    deleteFollow
        .deleteFollows(mainUsername, followList)
        .then(() => deleteFollowers(i + batchSize))
        .catch((err) => console.log("error while deleting followers: " + err));
}
function createUserList(i) {
    let users = [];
    let limit = i + batchSize;
    for (let j = i; j < limit; ++j) {
        let user = new tweeter_shared_1.User(firstName + j, lastName + j, followername + j, imageUrl);
        users.push(user);
    }
    return users;
}
function deleteUsers(i) {
    if (i >= numUsers)
        return;
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
