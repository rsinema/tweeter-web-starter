import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(
      authToken!,
      displayedUser!,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load feed items";
  }
}
