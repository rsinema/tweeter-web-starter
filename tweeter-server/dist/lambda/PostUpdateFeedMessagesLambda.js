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
const FollowService_1 = require("../model/service/FollowService");
const tweeter_shared_1 = require("tweeter-shared");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        const service = new FollowService_1.FollowService(new DynamoDAOFactory_1.DynamoDAOFactory());
        // extract the alias and the status from the body
        const parsed_body = JSON.parse(body);
        const status = tweeter_shared_1.Status.fromJson(JSON.stringify(parsed_body));
        const user = status === null || status === void 0 ? void 0 : status.user;
        let aliasList = [];
        // get a page of follower aliases
        aliasList = yield service.getFollowers(user);
        const sqs_url = "https://sqs.us-west-2.amazonaws.com/710560088359/UpdateFeedQueue";
        const sqsClient = new client_sqs_1.SQSClient();
        const params = {
            MessageBody: createItem(aliasList, status),
            QueueUrl: sqs_url,
        };
        yield sqsClient.send(new client_sqs_1.SendMessageCommand(params));
    }
});
exports.handler = handler;
function createItem(aliasList, status) {
    return JSON.stringify({ ["aliasList"]: aliasList, ["status"]: status });
}
