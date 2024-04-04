import { LoginRequest } from "./LoginRequest";

export class RegisterRequest extends LoginRequest {
  public firstName: string;
  public lastName: string;
  public userImageBase64String: string;

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    image: string
  ) {
    super(username, password);
    this.firstName = firstName;
    this.lastName = lastName;
    this.userImageBase64String = image;
  }
}
