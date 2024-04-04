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
exports.DynamoFollowDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoFollowDAO {
    constructor() {
        this.tableName = "follows";
        this.indexName = "follows_index";
        this.followersHandleAttr = "follower_handle";
        this.followeesHandleAttr = "followee_handle";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putFollow(follow) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: this.generateFollowItem(follow),
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    updateFollow(follow) {
        return __awaiter(this, void 0, void 0, function* () {
            this.putFollow(follow);
        });
    }
    getFollow(follow) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateFollowItem(follow),
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined ? false : true;
        });
    }
    getFollowers(alias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.followeesHandleAttr + " = :followee",
                ExpressionAttributeValues: {
                    ":followee": alias,
                },
                TableName: this.tableName,
                IndexName: this.indexName,
            };
            const items = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((item) => items.push(item[this.followersHandleAttr]));
            return items;
        });
    }
    deleteFollow(follow) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateFollowItem(follow),
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
    getPageOfFollowees(followerHandle, pageSize, lastFolloweeHandle = undefined) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.followersHandleAttr + " = :follower",
                ExpressionAttributeValues: {
                    ":follower": followerHandle,
                },
                TableName: this.tableName,
                Limit: pageSize,
                ExclusiveStartKey: lastFolloweeHandle === undefined
                    ? undefined
                    : {
                        [this.followersHandleAttr]: followerHandle,
                        [this.followeesHandleAttr]: lastFolloweeHandle,
                    },
            };
            const items = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((item) => items.push(item[this.followeesHandleAttr]));
            return [items, hasMorePages];
        });
    }
    getPageOfFollowers(followeeHandle, pageSize, lastFollowerHandle = undefined) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.followeesHandleAttr + " = :followee",
                ExpressionAttributeValues: {
                    ":followee": followeeHandle,
                },
                TableName: this.tableName,
                IndexName: this.indexName,
                Limit: pageSize,
                ExclusiveStartKey: lastFollowerHandle === undefined
                    ? undefined
                    : {
                        [this.followersHandleAttr]: lastFollowerHandle,
                        [this.followeesHandleAttr]: followeeHandle,
                    },
            };
            const items = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((item) => items.push(item[this.followersHandleAttr]));
            return [items, hasMorePages];
        });
    }
    generateFollowItem(follow) {
        return {
            [this.followersHandleAttr]: follow.follower.alias,
            [this.followeesHandleAttr]: follow.followee.alias,
        };
    }
}
exports.DynamoFollowDAO = DynamoFollowDAO;
