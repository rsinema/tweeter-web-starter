import {
  AuthenticateResponse,
  FollowRequest,
  FollowResponse,
  LoginRequest,
  RegisterRequest,
  TweeterRequest,
  TweeterResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://h90aelflai.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/login";
    const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(
      request,
      endpoint
    );

    return AuthenticateResponse.fromJson(response);
  }

  async logout(request: TweeterRequest): Promise<TweeterResponse> {
    const endpoint = "/logout";
    const response: JSON = await this.clientCommunicator.doPost<TweeterRequest>(
      request,
      endpoint
    );

    return TweeterResponse.fromJson(response);
  }

  async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    const endpoint = "/register";
    const response: JSON =
      await this.clientCommunicator.doPost<RegisterRequest>(request, endpoint);

    return AuthenticateResponse.fromJson(response);
  }

  async follow(request: FollowRequest): Promise<FollowResponse> {
    const endpoint = "/follow";
    const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(
      request,
      endpoint
    );

    return FollowResponse.fromJson(response);
  }

  async unfollow(request: FollowRequest): Promise<FollowResponse> {
    const endpoint = "/follow";
    const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(
      request,
      endpoint
    );

    return FollowResponse.fromJson(response);
  }

  async getIsFollowerStatus(
    request: FollowStatusRequest
  ): Promise<FollowStatusResponse> {
    const endpoint = "/followstatus";
    const response: JSON =
      await this.clientCommunicator.doPost<FollowStatusRequest>(
        request,
        endpoint
      );

    return FollowStatusResponse.fromJson(response);
  }

  async;
}
