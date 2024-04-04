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
        this.indexName = "followee_index";
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
