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
exports.DynamoAuthenticationDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoAuthenticationDAO {
    constructor() {
        this.tableName = "authentication";
        this.usernameAttr = "username";
        this.passwordAttr = "password";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.usernameAttr]: username,
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (output === undefined) {
                return false;
            }
            console.log(output.Item.password);
            if (password === output.Item.password) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    putAuthentication(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.usernameAttr]: username,
                    [this.passwordAttr]: password,
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    deleteAuthentication(username) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("delete not implemented yet");
        });
    }
}
exports.DynamoAuthenticationDAO = DynamoAuthenticationDAO;
