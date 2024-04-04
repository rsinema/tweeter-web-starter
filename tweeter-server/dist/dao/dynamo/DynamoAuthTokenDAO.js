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
exports.DynamoAuthTokenDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoAuthTokenDAO {
    constructor() {
        this.tableName = "authtokens";
        this.authtokenAttr = "authtoken";
        this.timestampAttr = "timestamp";
        this.userAliasAttr = "user_alias";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    checkAuthToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.authtokenAttr]: token.token,
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (output.Item === undefined) {
                return [undefined, undefined];
            }
            const curr_time = Date.now();
            const minutesElapsed = (curr_time - output.Item.timestamp) / 60000;
            // console.log(minutesElapsed);
            token.timestamp = curr_time;
            if (minutesElapsed < 60) {
                this.putAuthToken(token, output.Item.user_alias);
                return [token, output.Item.user_alias];
            }
            else {
                this.deleteAuthToken(token);
                return [undefined, undefined];
            }
        });
    }
    putAuthToken(token, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: this.generateAuthTokenItem(token, alias),
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    deleteAuthToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(token);
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.authtokenAttr]: token.token,
                },
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
    generateAuthTokenItem(token, alias) {
        return {
            [this.authtokenAttr]: token.token,
            [this.timestampAttr]: token.timestamp,
            [this.userAliasAttr]: alias,
        };
    }
}
exports.DynamoAuthTokenDAO = DynamoAuthTokenDAO;
