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
exports.FollowService = void 0;
class FollowService {
    constructor(daoFactory) {
        this.daoFactory = daoFactory;
    }
    loadMoreFollowers(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const followDAO = this.daoFactory.getFollowDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const validToken = yield authTokenDAO.checkAuthToken(authToken);
            if (validToken === undefined) {
                throw new Error("This session token has expired. Please log back in");
            }
            const item = lastItem ? lastItem.alias : undefined;
            const [aliasList, hasMoreItems] = yield followDAO.getPageOfFollowers(user.alias, pageSize, item);
            let userList = [];
            for (let i = 0; i < aliasList.length; i++) {
                let user = yield userDAO.getUser(aliasList[i]);
                if (!!user) {
                    userList.push(user);
                }
            }
            return [userList, hasMoreItems];
        });
    }
    loadMoreFollowees(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const followDAO = this.daoFactory.getFollowDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const validToken = yield authTokenDAO.checkAuthToken(authToken);
            if (validToken === undefined) {
                throw new Error("This session token has expired. Please log back in");
            }
            const item = lastItem ? lastItem.alias : undefined;
            const [aliasList, hasMoreItems] = yield followDAO.getPageOfFollowees(user.alias, pageSize, item);
            let userList = [];
            for (let i = 0; i < aliasList.length; i++) {
                let user = yield userDAO.getUser(aliasList[i]);
                if (!!user) {
                    userList.push(user);
                }
            }
            return [userList, hasMoreItems];
        });
    }
    loadMoreFollowersAlias(user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const followDAO = this.daoFactory.getFollowDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const item = lastItem ? lastItem.alias : undefined;
            const [aliasList, hasMoreItems] = yield followDAO.getPageOfFollowers(user.alias, pageSize, item);
            return [aliasList, hasMoreItems];
        });
    }
    getFollowers(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const followDAO = this.daoFactory.getFollowDAO();
            const aliasList = yield followDAO.getFollowers(user.alias);
            return aliasList;
        });
    }
}
exports.FollowService = FollowService;
