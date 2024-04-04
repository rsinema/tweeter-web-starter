"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const DynamoAuthTokenDAO_1 = require("./DynamoAuthTokenDAO");
const DynamoAuthenticationDAO_1 = require("./DynamoAuthenticationDAO");
const DynamoFeedDAO_1 = require("./DynamoFeedDAO");
const DynamoFollowDAO_1 = require("./DynamoFollowDAO");
const DynamoStatusDAO_1 = require("./DynamoStatusDAO");
const DynamoUserDAO_1 = require("./DynamoUserDAO");
const S3AccessDAO_1 = require("./S3AccessDAO");
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
    getStatusDAO() {
        return new DynamoStatusDAO_1.DynamoStatusDAO();
    }
    getFeedDAO() {
        return new DynamoFeedDAO_1.DynamoFeedDAO();
    }
    getFileDAO() {
        return new S3AccessDAO_1.S3AccessDAO();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
