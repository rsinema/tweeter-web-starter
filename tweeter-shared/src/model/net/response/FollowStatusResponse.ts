import { ResponseJson, TweeterResponse } from "./Response";

export class FollowStatusResponse extends TweeterResponse {
  private _followStatus: boolean;

  constructor(success: boolean, followStatus: boolean, message: string | null) {
    super(success, message);
    this._followStatus = followStatus;
  }

  get followStatus() {
    return this._followStatus;
  }

  static fromJson(json: JSON) {
    interface FollowStatusResponseJson extends ResponseJson {
      _followStatus: boolean;
    }

    const jsonObject: FollowStatusResponseJson =
      json as unknown as FollowStatusResponseJson;

    return new FollowStatusResponse(
      jsonObject._success,
      jsonObject._followStatus,
      jsonObject._message
    );
  }
}
