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
const UserService_1 = require("../model/service/UserService");
const tweeter_shared_1 = require("tweeter-shared");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.authtoken === null ||
        event.authtoken === undefined ||
        event.user === null ||
        event.selectedUser == null) {
        throw new Error("[Bad Request] Bad request");
    }
    let response = null;
    try {
        response = new tweeter_shared_1.FollowStatusResponse(true, yield new UserService_1.UserService(new DynamoDAOFactory_1.DynamoDAOFactory()).getIsFollowerStatus(event.authtoken, event.user, event.selectedUser), null);
    }
    catch (error) {
        throw new Error(`[Database Error] ${error}.message`);
    }
    return response;
});
exports.handler = handler;
