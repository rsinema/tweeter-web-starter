import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { ResponseJson, TweeterResponse } from "./Response";

export class AuthenticateResponse extends TweeterResponse {
  private _user: User;
  private _token: AuthToken;

  constructor(
    success: boolean,
    user: User,
    token: AuthToken,
    message: string | null = null
  ) {
    super(success, message);
    this._user = user;
    this._token = token;
  }

  get user() {
    return this._user;
  }

  get token() {
    return this._token;
  }

  static fromJson(json: JSON): AuthenticateResponse {
    interface AuthenticateResponseJson extends ResponseJson {
      _user: JSON;
      _token: JSON;
    }

    const jsonObject: AuthenticateResponseJson =
      json as unknown as AuthenticateResponseJson;
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

    if (deserializedUser === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject._user)
      );
    }

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject._token)
    );

    if (deserializedToken === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject._token)
      );
    }

    return new AuthenticateResponse(
      jsonObject._success,
      deserializedUser,
      deserializedToken,
      jsonObject._message
    );
  }
}
