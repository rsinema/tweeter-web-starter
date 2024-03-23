import { ResponseJson, TweeterResponse } from "./Response";

export class FollowResponse extends TweeterResponse {
  private _followersCount: number;
  private _followeesCount: number;

  constructor(
    success: boolean,
    followers: number,
    followees: number,
    message: string | null
  ) {
    super(success, message);
    this._followersCount = followers;
    this._followeesCount = followees;
  }

  get followersCount() {
    return this._followersCount;
  }

  get followeesCount() {
    return this._followeesCount;
  }

  static fromJson(json: JSON): FollowResponse {
    interface FollowResponseJson extends ResponseJson {
      _followersCount: number;
      _followeesCount: number;
    }

    const jsonObject: FollowResponseJson =
      json as unknown as FollowResponseJson;

    return new FollowResponse(
      jsonObject._success,
      jsonObject._followersCount,
      jsonObject._followeesCount,
      jsonObject._message
    );
  }
}
