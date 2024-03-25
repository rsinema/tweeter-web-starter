import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./Request";

export class GetFollowCountRequest extends TweeterRequest {
  public type: string;
  public user: User;

  constructor(
    alias: string,
    token: AuthToken | undefined,
    user: User,
    type: string
  ) {
    super(alias, token);
    this.user = user;
    this.type = type;
  }
}
