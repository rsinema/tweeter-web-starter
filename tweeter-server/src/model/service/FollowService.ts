import { AuthToken, User, FakeData } from "tweeter-shared";
import { DAOFactoryInterface } from "../../dao/DAOFactory";

export class FollowService {
  private daoFactory: DAOFactoryInterface;

  constructor(daoFactory: DAOFactoryInterface) {
    this.daoFactory = daoFactory;
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const validToken = await authTokenDAO.checkAuthToken(authToken);

    if (validToken === undefined) {
      throw new Error("This session token has expired. Please log back in");
    }

    const item = lastItem ? lastItem.alias : undefined;

    const [aliasList, hasMoreItems] = await followDAO.getPageOfFollowers(
      user.alias,
      pageSize,
      item
    );

    let userList: User[] = [];

    for (let i = 0; i < aliasList.length; i++) {
      let user = await userDAO.getUser(aliasList[i]);
      if (!!user) {
        userList.push(user);
      }
    }

    return [userList, hasMoreItems];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const validToken = await authTokenDAO.checkAuthToken(authToken);

    if (validToken === undefined) {
      throw new Error("This session token has expired. Please log back in");
    }

    const item = lastItem ? lastItem.alias : undefined;

    const [aliasList, hasMoreItems] = await followDAO.getPageOfFollowees(
      user.alias,
      pageSize,
      item
    );

    let userList: User[] = [];

    for (let i = 0; i < aliasList.length; i++) {
      let user = await userDAO.getUser(aliasList[i]);
      if (!!user) {
        userList.push(user);
      }
    }

    return [userList, hasMoreItems];
  }

  public async loadMoreFollowersAlias(
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[string[], boolean]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();

    const item = lastItem ? lastItem.alias : undefined;

    const [aliasList, hasMoreItems] = await followDAO.getPageOfFollowers(
      user.alias,
      pageSize,
      item
    );

    return [aliasList, hasMoreItems];
  }

  public async getFollowers(user: User): Promise<string[]> {
    const followDAO = this.daoFactory.getFollowDAO();

    const aliasList = await followDAO.getFollowers(user.alias);

    return aliasList;
  }
}
