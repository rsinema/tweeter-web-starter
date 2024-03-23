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
    if (event.firstName === undefined ||
        event.lastName === undefined ||
        event.alias === undefined ||
        event.password === undefined ||
        event.userImageBase64String === undefined) {
        return new tweeter_shared_1.AuthenticateResponse(false, new tweeter_shared_1.User("", "", "", ""), new tweeter_shared_1.AuthToken("", 0), "Bad Request");
    }
    let response = new tweeter_shared_1.AuthenticateResponse(true, ...(yield new UserService_1.UserService().register(event.firstName, event.lastName, event.alias, event.password, event.userImageBase64String)), null);
    return response;
});
exports.handler = handler;
