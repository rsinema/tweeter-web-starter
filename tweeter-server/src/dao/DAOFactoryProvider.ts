import { DAOFactoryInterface } from "./DAOFactory";
import { DynamoDAOFactory } from "./dynamo/DynamoDAOFactory";

export class DAOFactoryProvider {
  public getFactory(): DAOFactoryInterface {
    return new DynamoDAOFactory();
  }
}
