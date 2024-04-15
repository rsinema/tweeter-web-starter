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
exports.DynamoFeedDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoFeedDAO {
    constructor() {
        this.tableName = "feed";
        this.aliasAttr = "alias";
        this.followeeAliasAttribute = "followee_alias";
        this.postAttr = "post";
        this.timestampAttr = "timestamp";
        this.formattedDateAttr = "date";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putFeedItem(feedOwnerAlias, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: this.generateFeedItem(feedOwnerAlias, status),
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getPageOfFeed(alias, pageSize, lastItem) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.aliasAttr + " = :alias",
                ExpressionAttributeValues: {
                    ":alias": alias,
                },
                TableName: this.tableName,
                Limit: pageSize,
                ScanIndexForward: false,
                ExclusiveStartKey: lastItem === undefined
                    ? undefined
                    : {
                        [this.followeeAliasAttribute]: lastItem.user.alias,
                        [this.timestampAttr]: lastItem.timestamp,
                    },
            };
            const items = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((item) => items.push([item[this.followeeAliasAttribute], item[this.timestampAttr]]));
            return [items, hasMorePages];
        });
    }
    putBatchOfFeedItems(aliasList, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (aliasList.length == 0) {
                return;
            }
            else {
                const params = {
                    RequestItems: {
                        [this.tableName]: this.generateBatchOfFeedItemRequests(aliasList, status),
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
    putUnprocessedItems(resp, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resp.UnprocessedItems != undefined) {
                let sec = 0.01;
                while (Object.keys(resp.UnprocessedItems).length > 0) {
                    //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
                    // @ts-ignore
                    params.RequestItems = resp.UnprocessedItems;
                    execSync("sleep " + sec);
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
    generateBatchOfFeedItemRequests(aliasList, status) {
        return aliasList.map((alias) => this.generateFeedItemRequest(alias, status));
    }
    generateFeedItemRequest(alias, status) {
        let item = this.generateFeedItem(alias, status);
        let request = {
            PutRequest: {
                Item: item,
            },
        };
        return request;
    }
    generateFeedItem(feedOwnerAlias, status) {
        return {
            [this.aliasAttr]: feedOwnerAlias,
            [this.followeeAliasAttribute]: status.user.alias,
            [this.postAttr]: status.post,
            [this.timestampAttr]: status.timestamp,
            [this.formattedDateAttr]: status.formattedDate,
        };
    }
}
exports.DynamoFeedDAO = DynamoFeedDAO;
function execSync(arg0) {
    throw new Error("Function not implemented.");
}
