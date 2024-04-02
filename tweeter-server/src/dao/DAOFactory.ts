import {
  AuthTokenDAO,
  AuthenticationDAO,
  FollowDAO,
  UserDAO,
} from "./DAOInterface";

export interface DAOFactoryInterface {
  getUserDAO(): UserDAO;
  getFollowDAO(): FollowDAO;
  getAuthenticationDAO(): AuthenticationDAO;
  getAuthTokenDAO(): AuthTokenDAO;
}
