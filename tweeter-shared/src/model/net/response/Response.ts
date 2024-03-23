export class TweeterResponse {
  private _success: boolean;
  private _message: string | null;

  constructor(success: boolean, message: string | null = null) {
    this._success = success;
    this._message = message;
  }

  get success() {
    return this._success;
  }

  get message() {
    return this._message;
  }

  static fromJson(json: JSON): TweeterResponse {
    const jsonObject: ResponseJson = json as unknown as ResponseJson;

    return new TweeterResponse(jsonObject._success, jsonObject._message);
  }
}

export interface ResponseJson {
  _success: boolean;
  _message: string;
}
