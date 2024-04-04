import { DAOFactoryInterface } from "../DAOFactory";
import {
  AuthenticationDAO,
  AuthTokenDAO,
  FeedDAO,
  FileDAO,
  StatusDAO,
} from "../DAOInterface";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoAuthenticationDAO } from "./DynamoAuthenticationDAO";
import { DynamoFeedDAO } from "./DynamoFeedDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { S3AccessDAO } from "./S3AccessDAO";

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
  getStatusDAO(): StatusDAO {
    return new DynamoStatusDAO();
  }
  getFeedDAO(): FeedDAO {
    return new DynamoFeedDAO();
  }
  getFileDAO(): FileDAO {
    return new S3AccessDAO();
  }
}
