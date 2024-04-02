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
exports.DynamoUserDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class DynamoUserDAO {
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
    getUser(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias,
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? undefined
                : new tweeter_shared_1.User(output.Item.first_name, output.Item.last_name, output.Item.alias, output.Item.image_url);
        });
    }
    putUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.getUser(user.alias)) !== undefined) {
                return false;
            }
            const params = {
                TableName: this.tableName,
                Item: this.generateUserItem(user),
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
            return true;
        });
    }
    deleteUser(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias,
                },
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
    getFolloweesCount(alias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias,
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return (_a = output.Item) === null || _a === void 0 ? void 0 : _a.followees;
        });
    }
    getFollowersCount(alias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias,
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return (_a = output.Item) === null || _a === void 0 ? void 0 : _a.followers;
        });
    }
    updateFolloweesCount(alias, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias,
                },
                UpdateExpression: "set " + this.followeesAttr + " = " + this.followeesAttr + " + :inc",
                ExpressionAttributeValues: {
                    ":inc": value,
                },
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    updateFollowersCount(alias, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias,
                },
                UpdateExpression: "set " + this.followersAttr + " = " + this.followersAttr + " + :inc",
                ExpressionAttributeValues: {
                    ":inc": value,
                },
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    generateUserItem(user) {
        return {
            [this.aliasAttr]: user.alias,
            [this.firstNameAttr]: user.firstName,
            [this.lastNameAttr]: user.lastName,
            [this.imageUrlAttr]: user.imageUrl,
            [this.followersAttr]: 0,
            [this.followeesAttr]: 0,
        };
    }
}
exports.DynamoUserDAO = DynamoUserDAO;
