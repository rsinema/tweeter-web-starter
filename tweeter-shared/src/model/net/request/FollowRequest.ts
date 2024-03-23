import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./Request";

export class FollowRequest extends TweeterRequest {
  public userToFollow: User;

  constructor(alias: string, token: AuthToken | undefined, user: User) {
    super(alias, token);
    this.userToFollow = user;
  }
}
