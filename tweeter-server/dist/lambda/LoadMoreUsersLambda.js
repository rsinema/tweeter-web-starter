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
const FollowService_1 = require("../model/service/FollowService");
const tweeter_shared_1 = require("tweeter-shared");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.authtoken === undefined ||
        event.alias === null ||
        event.authtoken === null ||
        event.pageSize === null) {
        throw new Error("[Bad Request] Bad request");
    }
    let response = null;
    try {
        if (event.type === "followers") {
            response = new tweeter_shared_1.LoadMoreUsersResponse(true, ...(yield new FollowService_1.FollowService().loadMoreFollowers(event.authtoken, event.displayedUser, event.pageSize, event.lastItem)), null);
            return response;
        }
        else {
            response = new tweeter_shared_1.LoadMoreUsersResponse(true, ...(yield new FollowService_1.FollowService().loadMoreFollowees(event.authtoken, event.displayedUser, event.pageSize, event.lastItem)), null);
        }
    }
    catch (error) {
        throw new Error(`[Database Error] ${error}.message`);
    }
    return response;
});
exports.handler = handler;
