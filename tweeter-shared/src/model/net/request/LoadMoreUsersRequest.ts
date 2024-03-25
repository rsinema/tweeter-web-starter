import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./Request";

export class LoadMoreUsersRequest extends TweeterRequest {
  public displayedUser: User;
  public lastItem: User | null;
  public pageSize: number;
  public type: string;

  constructor(
    alias: string,
    token: AuthToken | undefined,
    displayedUser: User,
    lastItem: User | null,
    pageSize: number,
    type: string
  ) {
    super(alias, token);
    this.displayedUser = displayedUser;
    this.lastItem = lastItem;
    this.pageSize = pageSize;
    this.type = type;
  }
}
