import { TweeterRequest } from "./Request";

export class LoginRequest extends TweeterRequest {
  public password: string;

  constructor(username: string, password: string) {
    super(username, undefined);
    this.password = password;
  }
}
