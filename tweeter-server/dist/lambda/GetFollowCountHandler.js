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
const UserService_1 = require("../model/service/UserService");
const tweeter_shared_1 = require("tweeter-shared");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.alias === undefined || event.authtoken === undefined) {
        return new tweeter_shared_1.GetFollowCountResponse(false, -1, "Bad Request");
    }
    if (event.type === "followers") {
        let response = new tweeter_shared_1.GetFollowCountResponse(true, yield new UserService_1.UserService().getFollowersCount(event.authtoken, event.user), null);
        return response;
    }
    else {
        let response = new tweeter_shared_1.GetFollowCountResponse(true, yield new UserService_1.UserService().getFolloweesCount(event.authtoken, event.user), null);
        return response;
    }
});
exports.handler = handler;
