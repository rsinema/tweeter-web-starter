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
exports.DynamoStatusDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class DynamoStatusDAO {
    constructor() {
        this.tableName = "status";
        this.aliasAttr = "alias";
        this.postAttr = "post";
        this.timestampAttr = "timestamp";
        this.formattedDateAttr = "date";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: this.generateStatusItem(status),
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getPageOfStatus(alias, pageSize, lastItem) {
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
                        [this.aliasAttr]: lastItem.user.alias,
                        [this.timestampAttr]: lastItem.timestamp,
                    },
            };
            const items = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((item) => items.push([item[this.aliasAttr], item[this.timestampAttr]]));
            return [items, hasMorePages];
        });
    }
    getStatus(alias, timestamp, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias,
                    [this.timestampAttr]: timestamp,
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? undefined
                : new tweeter_shared_1.Status(output.Item.post, user, output.Item.timestamp);
        });
    }
    generateStatusItem(status) {
        return {
            [this.aliasAttr]: status.user.alias,
            [this.postAttr]: status.post,
            [this.timestampAttr]: status.timestamp,
            [this.formattedDateAttr]: status.formattedDate,
        };
    }
}
exports.DynamoStatusDAO = DynamoStatusDAO;
