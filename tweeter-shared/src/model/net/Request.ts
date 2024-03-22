import { AuthToken } from "../domain/AuthToken";

export class TweeterRequest {
  private _alias: string;
  private _authtoken: AuthToken | undefined;

  constructor(alias: string, authtoken: AuthToken | undefined) {
    this._alias = alias;
    this._authtoken = authtoken;
  }

  get alias() {
    return this._alias;
  }

  get authtoken() {
    return this._authtoken;
  }
}

export class LoginRequest extends TweeterRequest {
  private _password: string;

  constructor(username: string, password: string) {
    super(username, undefined);
    this._password = password;
  }

  get password() {
    return this._password;
  }
}

export class RegisterRequest extends LoginRequest {
  private _firstName: string;
  private _lastName: string;
  private _userImageBytes: Uint8Array;

  constructor(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    image: Uint8Array
  ) {
    super(username, password);
    this._firstName = firstName;
    this._lastName = lastName;
    this._userImageBytes = image;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get userImageBytes() {
    return this._userImageBytes;
  }
}
