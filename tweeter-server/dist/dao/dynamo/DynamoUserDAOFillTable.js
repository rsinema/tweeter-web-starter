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
exports.DynamoUserDAOFillTable = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const child_process_1 = require("child_process");
class DynamoUserDAOFillTable {
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
    createUsers(userList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userList.length == 0) {
                console.log("zero followers to batch write");
                return;
            }
            else {
                const params = {
                    RequestItems: {
                        [this.tableName]: this.createPutUserRequestItems(userList),
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
    createPutUserRequestItems(userList) {
        return userList.map((user) => this.createPutUserRequest(user));
    }
    createPutUserRequest(user) {
        let item = {
            [this.aliasAttr]: user.alias,
            [this.firstNameAttr]: user.firstName,
            [this.lastNameAttr]: user.lastName,
            [this.imageUrlAttr]: user.imageUrl,
            [this.followersAttr]: 0,
            [this.followeesAttr]: 1,
        };
        let request = {
            PutRequest: {
                Item: item,
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
            ExpressionAttributeValues: { ":inc": count },
            UpdateExpression: "SET " + this.followersAttr + " = " + this.followersAttr + " + :inc",
        };
        this.client.send(new lib_dynamodb_1.UpdateCommand(params)).then((data) => {
            return true;
        });
    }
}
exports.DynamoUserDAOFillTable = DynamoUserDAOFillTable;
