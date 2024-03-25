import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken) {
    await new Promise((res) => setTimeout(res, 1000));
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ): Promise<[User, AuthToken]> {
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return FakeData.instance.getFollowersCount(user);
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return FakeData.instance.getFolloweesCount(user);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    await new Promise((res) => setTimeout(res, 1000));

    let followersCount = await this.getFollowersCount(authToken, userToFollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    await new Promise((res) => setTimeout(res, 1000));

    let followersCount = await this.getFollowersCount(
      authToken,
      userToUnfollow
    );
    let followeesCount = await this.getFolloweesCount(
      authToken,
      userToUnfollow
    );

    return [followersCount, followeesCount];
  }
}
