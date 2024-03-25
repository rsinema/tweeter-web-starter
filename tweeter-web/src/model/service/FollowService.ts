import {
  AuthToken,
  User,
  FakeData,
  LoadMoreUsersResponse,
  LoadMoreUsersRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const server = new ServerFacade();
    const response: LoadMoreUsersResponse = await server.loadMoreUsers(
      new LoadMoreUsersRequest(
        "",
        authToken,
        user,
        lastItem,
        pageSize,
        "followers"
      )
    );

    const userList = response.itemsList;
    const hasMoreItems = response.hasMoreItems;

    return [userList, hasMoreItems];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const server = new ServerFacade();
    const response: LoadMoreUsersResponse = await server.loadMoreUsers(
      new LoadMoreUsersRequest(
        "",
        authToken,
        user,
        lastItem,
        pageSize,
        "followees"
      )
    );

    const userList = response.itemsList;
    const hasMoreItems = response.hasMoreItems;

    return [userList, hasMoreItems];
  }
}
