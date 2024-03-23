import { AuthToken } from "../../domain/AuthToken";

export class TweeterRequest {
  public alias: string;
  public authtoken: AuthToken | undefined;

  constructor(alias: string, authtoken: AuthToken | undefined) {
    this.alias = alias;
    this.authtoken = authtoken;
  }
}
