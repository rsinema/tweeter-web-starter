import { UserService } from "../model/service/UserService";
import { AuthenticateResponse, LoginRequest } from "tweeter-shared";

export const handler = async (
  event: LoginRequest
): Promise<AuthenticateResponse> => {
  let response = new AuthenticateResponse(
    true,
    ...(await new UserService().login(event.alias, event.password)),
    null
  );
  return response;
};
