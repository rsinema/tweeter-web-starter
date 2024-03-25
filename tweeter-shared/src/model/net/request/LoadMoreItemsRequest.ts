import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { TweeterRequest } from "./Request";

export class LoadMoreItemsRequest extends TweeterRequest {
  public displayedUser: User;
  public lastItem: Status | null;
  public pageSize: number;

  constructor(
    alias: string,
    token: AuthToken | undefined,
    displayedUser: User,
    lastItem: Status | null,
    pageSize: number
  ) {
    super(alias, token);
    this.displayedUser = displayedUser;
    this.lastItem = lastItem;
    this.pageSize = pageSize;
  }
}
