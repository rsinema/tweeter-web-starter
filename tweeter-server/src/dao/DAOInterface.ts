import { AuthToken, Follow, Status, User } from "tweeter-shared";

export interface FollowDAO {
  putFollow(follow: Follow): Promise<void>;
  getFollow(follow: Follow): Promise<boolean>;
  deleteFollow(follow: Follow): Promise<void>;
  getFollowers(alias: string): Promise<string[]>;
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

export interface StatusDAO {
  putStatus(status: Status): Promise<void>;
  getStatus(
    alias: string,
    timestamp: number,
    user: User
  ): Promise<Status | undefined>;
  getPageOfStatus(
    alias: string,
    pageSize: number,
    lastItem: Status | undefined
  ): Promise<[[string, number][], boolean]>;
}

export interface FeedDAO {
  putFeedItem(feedOwnerAlias: string, item: Status): Promise<void>;
  getPageOfFeed(
    alias: string,
    pageSize: number,
    lastItem: Status | undefined
  ): Promise<[[string, number][], boolean]>;
}

export interface AuthenticationDAO {
  getPassword(username: string): Promise<string | undefined>;
  putAuthentication(
    username: string,
    password: string,
    salt: string
  ): Promise<void>;
}

export interface AuthTokenDAO {
  checkAuthToken(
    token: AuthToken
  ): Promise<[AuthToken, string] | [undefined, undefined]>;
  putAuthToken(token: AuthToken, alias: string): Promise<void>;
  deleteAuthToken(token: AuthToken): Promise<void>;
}

export interface FileDAO {
  putFile(encodedImage: string, userAlias: string): Promise<string>;
}
