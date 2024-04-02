import { DAOFactoryInterface } from "../DAOFactory";
import { AuthenticationDAO, AuthTokenDAO } from "../DAOInterface";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoAuthenticationDAO } from "./DynamoAuthenticationDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoDAOFactory implements DAOFactoryInterface {
  getAuthenticationDAO(): AuthenticationDAO {
    return new DynamoAuthenticationDAO();
  }
  getAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }
  getUserDAO() {
    return new DynamoUserDAO();
  }
  getFollowDAO() {
    return new DynamoFollowDAO();
  }
}
