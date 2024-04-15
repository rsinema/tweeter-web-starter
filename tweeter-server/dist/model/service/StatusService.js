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
exports.StatusService = void 0;
class StatusService {
    constructor(daoFactory) {
        this.daoFactory = daoFactory;
    }
    loadMoreFeedItems(authToken, displayedUser, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedDAO = this.daoFactory.getFeedDAO();
            const statusDAO = this.daoFactory.getStatusDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const validToken = yield authTokenDAO.checkAuthToken(authToken);
            if (validToken[0] === undefined) {
                throw new Error("This session token has expired. Please log back in");
            }
            const [alias_timestamps, hasMorePages] = yield feedDAO.getPageOfFeed(displayedUser.alias, pageSize, lastItem);
            let statusList = [];
            for (let i = 0; i < alias_timestamps.length; i++) {
                let user = yield userDAO.getUser(alias_timestamps[i][0]);
                if (!!user) {
                    let status = yield statusDAO.getStatus(alias_timestamps[i][0], alias_timestamps[i][1], user);
                    if (!!status) {
                        statusList.push(status);
                    }
                }
            }
            return [statusList, hasMorePages];
        });
    }
    loadMoreStoryItems(authToken, displayedUser, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const statusDAO = this.daoFactory.getStatusDAO();
            const userDAO = this.daoFactory.getUserDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const validToken = yield authTokenDAO.checkAuthToken(authToken);
            if (validToken[0] === undefined) {
                throw new Error("This session token has expired. Please log back in");
            }
            const [alias_timestamps, hasMorePages] = yield statusDAO.getPageOfStatus(displayedUser.alias, pageSize, lastItem);
            let statusList = [];
            for (let i = 0; i < alias_timestamps.length; i++) {
                let user = yield userDAO.getUser(alias_timestamps[i][0]);
                if (!!user) {
                    let status = yield statusDAO.getStatus(alias_timestamps[i][0], alias_timestamps[i][1], user);
                    if (!!status) {
                        statusList.push(status);
                    }
                }
            }
            return [statusList, hasMorePages];
        });
    }
    postStatus(authToken, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const statusDAO = this.daoFactory.getStatusDAO();
            const authTokenDAO = this.daoFactory.getAuthTokenDAO();
            const validToken = yield authTokenDAO.checkAuthToken(authToken);
            if (validToken[0] === undefined) {
                throw new Error("This session token has expired. Please log back in");
            }
            yield statusDAO.putStatus(newStatus);
        });
    }
    postToFeed(aliasList, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedDAO = this.daoFactory.getFeedDAO();
            for (let i = 0; i < aliasList.length; i = i + 25) {
                let aliasBatch = [];
                let k = i + 25;
                if (i + 25 > aliasList.length) {
                    k = aliasList.length;
                }
                for (let j = i; j < k; j++) {
                    aliasBatch.push(aliasList[j]);
                }
                yield feedDAO.putBatchOfFeedItems(aliasList, status);
            }
        });
    }
}
exports.StatusService = StatusService;
