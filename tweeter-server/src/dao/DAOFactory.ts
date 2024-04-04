import {
  AuthTokenDAO,
  AuthenticationDAO,
  FeedDAO,
  FileDAO,
  FollowDAO,
  StatusDAO,
  UserDAO,
} from "./DAOInterface";

export interface DAOFactoryInterface {
  getUserDAO(): UserDAO;
  getFollowDAO(): FollowDAO;
  getAuthenticationDAO(): AuthenticationDAO;
  getAuthTokenDAO(): AuthTokenDAO;
  getStatusDAO(): StatusDAO;
  getFeedDAO(): FeedDAO;
  getFileDAO(): FileDAO;
}
