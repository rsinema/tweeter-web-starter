import { AuthToken, User, Status, FakeData } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    displayedUser: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    displayedUser: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }
}
