"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const DynamoAuthTokenDAO_1 = require("./DynamoAuthTokenDAO");
const DynamoAuthenticationDAO_1 = require("./DynamoAuthenticationDAO");
const DynamoFollowDAO_1 = require("./DynamoFollowDAO");
const DynamoUserDAO_1 = require("./DynamoUserDAO");
class DynamoDAOFactory {
    getAuthenticationDAO() {
        return new DynamoAuthenticationDAO_1.DynamoAuthenticationDAO();
    }
    getAuthTokenDAO() {
        return new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
    }
    getUserDAO() {
        return new DynamoUserDAO_1.DynamoUserDAO();
    }
    getFollowDAO() {
        return new DynamoFollowDAO_1.DynamoFollowDAO();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
