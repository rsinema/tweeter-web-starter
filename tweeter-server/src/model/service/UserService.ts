import { AuthToken, Follow, User } from "tweeter-shared";
import { DAOFactoryInterface } from "../../dao/DAOFactory";
import { genSalt, hash, compare } from "bcryptjs";

export class UserService {
  private daoFactory: DAOFactoryInterface;

  constructor(daoFactory: DAOFactoryInterface) {
    this.daoFactory = daoFactory;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
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

    const hashed_password = await authenticationDAO.getPassword(alias);

    if (hashed_password === undefined) {
      throw new Error("[Database Error] Unable to retrieve data from database");
    }

    const valid = await this.authenticate(password, hashed_password);

    if (!valid) {
      throw new Error("[Bad Request] Invalid username or password");
    }

    alias = "@" + alias;
    const user = await userDAO.getUser(alias);

    if (user === undefined) {
      throw new Error("[Database Error] Could not find user in database");
    }

    const token = AuthToken.Generate();
    await authTokenDAO.putAuthToken(token, user.alias);

    return [user, token];
  }

  public async logout(authToken: AuthToken) {
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const [token, alias] = await authTokenDAO.checkAuthToken(authToken);

    if (token === undefined) {
      throw new Error("This session token has expired. Please log back in");
    }

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
    const s3DAO = this.daoFactory.getFileDAO();

    const username = alias;
    alias = "@" + alias;

    const userImageURL = await s3DAO.putFile(imageStringBase64, alias);

    const user = new User(firstName, lastName, alias, userImageURL);
    const valid = await userDAO.putUser(user);

    if (valid === false) {
      throw new Error("[Bad Request] Invalid registration");
    }

    const salt = await genSalt(10);
    const hashed_password = await hash(password, salt);

    await authenticationDAO.putAuthentication(username, hashed_password, salt);

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

    if (userThatIsFollowing === undefined) {
      throw new Error("User not found in the database");
    }

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

    await followDAO.deleteFollow(
      new Follow(userThatIsFollowing!, userToUnfollow)
    );

    await userDAO.updateFollowersCount(userToUnfollow.alias, -1);
    await userDAO.updateFolloweesCount(userThatIsFollowing!.alias, -1);

    const followers = await userDAO.getFollowersCount(userToUnfollow.alias);
    const followees = await userDAO.getFolloweesCount(userToUnfollow.alias);

    return [followers, followees];
  }

  private async authenticate(password: string, hashed_password: string) {
    return await compare(password, hashed_password);
  }
}
