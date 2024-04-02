"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOFactoryProvider = void 0;
const DynamoDAOFactory_1 = require("./dynamo/DynamoDAOFactory");
class DAOFactoryProvider {
    getFactory() {
        return new DynamoDAOFactory_1.DynamoDAOFactory();
    }
}
exports.DAOFactoryProvider = DAOFactoryProvider;
