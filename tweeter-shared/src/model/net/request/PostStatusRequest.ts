import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { TweeterRequest } from "./Request";

export class PostStatusRequest extends TweeterRequest {
  public status: Status;

  constructor(alias: string, token: AuthToken | undefined, status: Status) {
    super(alias, token);
    this.status = status;
  }
}
