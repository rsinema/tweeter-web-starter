import { User } from "../../domain/User";
import { TweeterResponse, ResponseJson } from "./Response";

export class GetUserResponse extends TweeterResponse {
  private _user: User | null;

  constructor(success: boolean, user: User | null, message: string | null) {
    super(success, message);
    this._user = user;
  }

  get user() {
    return this._user;
  }

  static fromJson(json: JSON): GetUserResponse {
    interface GetUserResponseJson extends ResponseJson {
      _user: JSON;
    }

    const jsonObject: GetUserResponseJson =
      json as unknown as GetUserResponseJson;
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

    return new GetUserResponse(
      jsonObject._success,
      deserializedUser,
      jsonObject._message
    );
  }
}
