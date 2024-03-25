import { ResponseJson, TweeterResponse } from "./Response";

export class GetFollowCountResponse extends TweeterResponse {
  private _count: number;

  constructor(success: boolean, count: number, message: string | null) {
    super(success, message);
    this._count = count;
  }

  get count() {
    return this._count;
  }

  static fromJson(json: JSON): GetFollowCountResponse {
    interface GetFollowCountResponseJson extends ResponseJson {
      _count: number;
    }

    const jsonObject: GetFollowCountResponseJson =
      json as unknown as GetFollowCountResponseJson;

    return new GetFollowCountResponse(
      jsonObject._success,
      jsonObject._count,
      jsonObject._message
    );
  }
}
