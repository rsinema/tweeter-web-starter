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
exports.handler = void 0;
const DynamoDAOFactory_1 = require("../dao/dynamo/DynamoDAOFactory");
const StatusService_1 = require("../model/service/StatusService");
const tweeter_shared_1 = require("tweeter-shared");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.authtoken === undefined ||
        event.authtoken === null ||
        event.alias === null) {
        throw new Error("[Bad Request] Bad request");
    }
    let response = null;
    const token = tweeter_shared_1.AuthToken.fromJson(JSON.stringify(event.authtoken));
    const status = tweeter_shared_1.Status.fromJson(JSON.stringify(event.status));
    const sqs_url = "https://sqs.us-west-2.amazonaws.com/710560088359/PostStatusQueue";
    const sqsClient = new client_sqs_1.SQSClient();
    const params = {
        DelaySeconds: 10,
        MessageBody: JSON.stringify(status),
        QueueUrl: sqs_url,
    };
    try {
        yield new StatusService_1.StatusService(new DynamoDAOFactory_1.DynamoDAOFactory()).postStatus(token, status);
        response = new tweeter_shared_1.TweeterResponse(true, null);
    }
    catch (error) {
        throw new Error(`[Database Error] ${error.message}`);
    }
    yield sqsClient.send(new client_sqs_1.SendMessageCommand(params));
    return response;
});
exports.handler = handler;
