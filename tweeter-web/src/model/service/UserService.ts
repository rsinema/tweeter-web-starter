import {
  AuthToken,
  FollowRequest,
  LoginRequest,
  RegisterRequest,
  TweeterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import { Buffer } from "buffer";

export class UserService {
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const server = new ServerFacade();
    return server.getUser(
      new GetUserRequest(new TweeterRequest(alias, authToken))
    );
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    const server = new ServerFacade();
    let imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const resp = await server.register(
      new RegisterRequest(
        firstName,
        lastName,
        alias,
        password,
        imageStringBase64
      )
    );
    let user = resp.user;
    let token = resp.token;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, token];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const server = new ServerFacade();
    const resp = await server.login(new LoginRequest(alias, password));
    let user = resp.user;
    let token = resp.token;

    if (user === null) {
      throw new Error(resp.message!);
    }

    return [user, token];
  }

  public async logout(authToken: AuthToken) {
    const server = new ServerFacade();
    await server.logout(new TweeterRequest("", authToken));
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const server = new ServerFacade();
    return server.getIsFollowerStatus(
      new FollowStatusRequest("", authToken, user, selectedUser)
    );
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    const server = new ServerFacade();
    const resp = await server.follow(
      new FollowRequest("", authToken, userToFollow)
    );

    let followersCount = resp.followersCount;
    let followeesCount = resp.followeesCount;

    return [followersCount, followeesCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    const server = new ServerFacade();
    const resp = await server.unfollow(
      new FollowRequest("", authToken, userToUnfollow)
    );

    let followersCount = resp.followersCount;
    let followeesCount = resp.followeesCount;

    return [followersCount, followeesCount];
  }
}
