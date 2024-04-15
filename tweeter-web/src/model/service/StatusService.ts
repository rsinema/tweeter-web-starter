import {
  AuthToken,
  User,
  Status,
  FakeData,
  PostStatusRequest,
  TweeterResponse,
  LoadMoreItemsResponse,
  LoadMoreItemsRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    displayedUser: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const server = new ServerFacade();
    const response: LoadMoreItemsResponse = await server.loadMoreFeedItems(
      new LoadMoreItemsRequest("", authToken, displayedUser, lastItem, pageSize)
    );

    console.log(response);

    const itemsList = response.itemsList;
    const hasMoreItems = response.hasMoreItems;
    return [itemsList, hasMoreItems];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    displayedUser: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const server = new ServerFacade();
    const response: LoadMoreItemsResponse = await server.loadMoreStoryItems(
      new LoadMoreItemsRequest("", authToken, displayedUser, lastItem, pageSize)
    );

    const itemsList = response.itemsList;
    const hasMoreItems = response.hasMoreItems;
    return [itemsList, hasMoreItems];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const server = new ServerFacade();
    const response: TweeterResponse = await server.postStatus(
      new PostStatusRequest("", authToken, newStatus)
    );
  }
}
