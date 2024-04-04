import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { DAOFactoryInterface } from "../../dao/DAOFactory";

export class StatusService {
  private daoFactory: DAOFactoryInterface;

  constructor(daoFactory: DAOFactoryInterface) {
    this.daoFactory = daoFactory;
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    displayedUser: User,
    pageSize: number,
    lastItem: Status | undefined
  ): Promise<[Status[], boolean]> {
    const feedDAO = this.daoFactory.getFeedDAO();
    const statusDAO = this.daoFactory.getStatusDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const validToken = await authTokenDAO.checkAuthToken(authToken);

    if (validToken[0] === undefined) {
      throw new Error("This session token has expired. Please log back in");
    }

    const [alias_timestamps, hasMorePages] = await feedDAO.getPageOfFeed(
      displayedUser.alias,
      pageSize,
      lastItem
    );

    let statusList: Status[] = [];

    for (let i = 0; i < alias_timestamps.length; i++) {
      let user = await userDAO.getUser(alias_timestamps[i][0]);

      if (!!user) {
        let status = await statusDAO.getStatus(
          alias_timestamps[i][0],
          alias_timestamps[i][1],
          user
        );
        if (!!status) {
          statusList.push(status);
        }
      }
    }

    return [statusList, hasMorePages];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    displayedUser: User,
    pageSize: number,
    lastItem: Status | undefined
  ): Promise<[Status[], boolean]> {
    const statusDAO = this.daoFactory.getStatusDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const validToken = await authTokenDAO.checkAuthToken(authToken);

    if (validToken[0] === undefined) {
      throw new Error("This session token has expired. Please log back in");
    }

    const [alias_timestamps, hasMorePages] = await statusDAO.getPageOfStatus(
      displayedUser.alias,
      pageSize,
      lastItem
    );

    let statusList: Status[] = [];

    for (let i = 0; i < alias_timestamps.length; i++) {
      let user = await userDAO.getUser(alias_timestamps[i][0]);

      if (!!user) {
        let status = await statusDAO.getStatus(
          alias_timestamps[i][0],
          alias_timestamps[i][1],
          user
        );
        if (!!status) {
          statusList.push(status);
        }
      }
    }

    return [statusList, hasMorePages];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const statusDAO = this.daoFactory.getStatusDAO();
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const feedDAO = this.daoFactory.getFeedDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const validToken = await authTokenDAO.checkAuthToken(authToken);

    if (validToken[0] === undefined) {
      throw new Error("This session token has expired. Please log back in");
    }

    const followeeAliasList = await followDAO.getFollowers(
      newStatus.user.alias
    );

    await statusDAO.putStatus(newStatus);

    for (let i = 0; i < followeeAliasList.length; i++) {
      await feedDAO.putFeedItem(followeeAliasList[i], newStatus);
    }
  }
}
