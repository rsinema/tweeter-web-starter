import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./Request";

export class FollowStatusRequest extends TweeterRequest {
  public selectedUser: User;
  public user: User;

  constructor(
    alias: string,
    token: AuthToken | undefined,
    user: User,
    selectedUser: User
  ) {
    super(alias, token);
    this.selectedUser = selectedUser;
    this.user = user;
  }
}
