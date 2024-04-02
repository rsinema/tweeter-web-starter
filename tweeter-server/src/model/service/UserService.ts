import { AuthToken, FakeData, Follow, User } from "tweeter-shared";
import { DAOFactoryInterface } from "../../dao/DAOFactory";

export class UserService {
  private daoFactory: DAOFactoryInterface;

  constructor(daoFactory: DAOFactoryInterface) {
    this.daoFactory = daoFactory;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    authToken = new AuthToken(authToken.token, authToken.timestamp);

    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const validToken = await authTokenDAO.checkAuthToken(authToken);

    if (validToken === undefined) {
      throw new Error("This session token has expired. Please log back in");
    }

    const user = await userDAO.getUser(alias);

    if (user === undefined) {
      return null;
    }

    return user;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const authenticationDAO = this.daoFactory.getAuthenticationDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const valid = await authenticationDAO.authenticate(alias, password);

    if (valid === false) {
      throw new Error("Invalid alias or password");
    }

    alias = "@" + alias;
    const user = await userDAO.getUser(alias);

    if (user === undefined) {
      throw new Error("Could not find user in database");
    }

    const token = AuthToken.Generate();
    authTokenDAO.putAuthToken(token, user.alias);

    return [user, token];
  }

  public async logout(authToken: AuthToken) {
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    await authTokenDAO.deleteAuthToken(authToken);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ): Promise<[User, AuthToken]> {
    const authenticationDAO = this.daoFactory.getAuthenticationDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    // TODO:: Make the S3 DAO
    const username = alias;
    alias = "@" + alias;
    const user = new User(
      firstName,
      lastName,
      alias,
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );
    const valid = await userDAO.putUser(user);

    if (valid === false) {
      throw new Error("Invalid registration");
    }

    await authenticationDAO.putAuthentication(username, password);

    const token = AuthToken.Generate();
    await authTokenDAO.putAuthToken(token, user.alias);

    return [user, token];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const followDAO = this.daoFactory.getFollowDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const token = await authTokenDAO.checkAuthToken(authToken);

    if (token === undefined) {
      throw new Error(
        "This session's token has expired. Please sign in and try again"
      );
    }

    const follow = new Follow(user, selectedUser);
    const isFollower = await followDAO.getFollow(follow);
    return isFollower;
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const token = await authTokenDAO.checkAuthToken(authToken);

    if (token === undefined) {
      throw new Error(
        "This session's token has expired. Please sign in and try again"
      );
    }

    const count = await userDAO.getFollowersCount(user.alias);

    return count;
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const token = await authTokenDAO.checkAuthToken(authToken);

    if (token === undefined) {
      throw new Error(
        "This session's token has expired. Please sign in and try again"
      );
    }

    const count = await userDAO.getFolloweesCount(user.alias);

    return count;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[number, number]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const [token, alias] = await authTokenDAO.checkAuthToken(authToken);

    if (token === undefined) {
      throw new Error(
        "This session's token has expired. Please sign in and try again"
      );
    }

    const userThatIsFollowing = await userDAO.getUser(alias);

    await followDAO.putFollow(new Follow(userThatIsFollowing!, userToFollow));

    await userDAO.updateFollowersCount(userToFollow.alias, 1);
    await userDAO.updateFolloweesCount(userThatIsFollowing!.alias, 1);

    const followers = await userDAO.getFollowersCount(userToFollow.alias);
    const followees = await userDAO.getFolloweesCount(userToFollow.alias);

    return [followers, followees];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const [token, alias] = await authTokenDAO.checkAuthToken(authToken);

    if (token === undefined) {
      throw new Error(
        "This session's token has expired. Please sign in and try again"
      );
    }

    const userThatIsFollowing = await userDAO.getUser(alias);

    await followDAO.putFollow(new Follow(userThatIsFollowing!, userToUnfollow));

    await userDAO.updateFollowersCount(userToUnfollow.alias, -1);
    await userDAO.updateFolloweesCount(userThatIsFollowing!.alias, -1);

    const followers = await userDAO.getFollowersCount(userToUnfollow.alias);
    const followees = await userDAO.getFolloweesCount(userToUnfollow.alias);

    return [followers, followees];
  }
}
