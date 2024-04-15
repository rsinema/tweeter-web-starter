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
const StatusService_1 = require("../model/service/StatusService");
const DynamoDAOFactory_1 = require("../dao/dynamo/DynamoDAOFactory");
const tweeter_shared_1 = require("tweeter-shared");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        const service = new StatusService_1.StatusService(new DynamoDAOFactory_1.DynamoDAOFactory());
        const parsed_body = JSON.parse(body);
        const status = tweeter_shared_1.Status.fromJson(JSON.stringify(parsed_body.status));
        const aliasList = parsed_body.aliasList;
        if (aliasList.length > 0) {
            // let s = "";
            for (let i = 0; i < aliasList.length; i = i + 25) {
                let k = i + 25;
                if (k > aliasList.length) {
                    k = aliasList.length;
                }
                let aliasBatch = [];
                for (let j = i; j < k; j++) {
                    aliasBatch.push(aliasList[j]);
                }
                // s = s + " " + i;
                yield service.postToFeed(aliasBatch, status);
            }
            // console.log(s);
        }
        else {
            console.log("No followers to post feed to");
        }
    }
});
exports.handler = handler;
