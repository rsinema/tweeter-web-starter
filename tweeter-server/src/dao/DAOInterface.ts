import { AuthToken, Follow, User } from "tweeter-shared";

export interface FollowDAO {
  putFollow(follow: Follow): Promise<void>;
  getFollow(follow: Follow): Promise<boolean>;
  deleteFollow(follow: Follow): Promise<void>;
  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[string[], boolean]>;
  getPageOfFollowees(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[string[], boolean]>;
}

export interface UserDAO {
  getUser(alias: string): Promise<User | undefined>;
  putUser(user: User): Promise<boolean>;
  deleteUser(alias: string): Promise<void>;
  getFollowersCount(alias: string): Promise<number>;
  getFolloweesCount(alias: string): Promise<number>;
  updateFollowersCount(alias: string, value: number): Promise<void>;
  updateFolloweesCount(alias: string, value: number): Promise<void>;
}

export interface AuthenticationDAO {
  authenticate(username: string, password: string): Promise<boolean>;
  putAuthentication(username: string, password: string): Promise<void>;
}

export interface AuthTokenDAO {
  checkAuthToken(
    token: AuthToken
  ): Promise<[AuthToken, string] | [undefined, undefined]>;
  putAuthToken(token: AuthToken, alias: string): Promise<void>;
  deleteAuthToken(token: AuthToken): Promise<void>;
}
