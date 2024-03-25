import {
  AuthenticateResponse,
  FollowRequest,
  FollowResponse,
  FollowStatusRequest,
  FollowStatusResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetUserResponse,
  LoadMoreItemsRequest,
  LoadMoreItemsResponse,
  LoadMoreUsersRequest,
  LoadMoreUsersResponse,
  LoginRequest,
  PostStatusRequest,
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
    const endpoint = "/unfollow";
    const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(
      request,
      endpoint
    );

    return FollowResponse.fromJson(response);
  }

  async getIsFollowerStatus(
    request: FollowStatusRequest
  ): Promise<FollowStatusResponse> {
    const endpoint = "/getfollowstatus";
    const response: JSON =
      await this.clientCommunicator.doPost<FollowStatusRequest>(
        request,
        endpoint
      );

    return FollowStatusResponse.fromJson(response);
  }

  async getUser(request: TweeterRequest): Promise<GetUserResponse> {
    const endpoint = "/getuser";
    const response: JSON = await this.clientCommunicator.doPost<TweeterRequest>(
      request,
      endpoint
    );

    return GetUserResponse.fromJson(response);
  }

  async getFollowCount(
    request: GetFollowCountRequest
  ): Promise<GetFollowCountResponse> {
    const endpoint = "/getfollowcount";
    const response: JSON =
      await this.clientCommunicator.doPost<GetFollowCountRequest>(
        request,
        endpoint
      );

    return GetFollowCountResponse.fromJson(response);
  }

  async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
    const endpoint = "/poststatus";
    const response: JSON =
      await this.clientCommunicator.doPost<PostStatusRequest>(
        request,
        endpoint
      );

    return TweeterResponse.fromJson(response);
  }

  async loadMoreStoryItems(
    request: LoadMoreItemsRequest
  ): Promise<LoadMoreItemsResponse> {
    const endpoint = "/loadstory";
    const repsonse: JSON =
      await this.clientCommunicator.doPost<LoadMoreItemsRequest>(
        request,
        endpoint
      );

    return LoadMoreItemsResponse.fromJson(repsonse);
  }

  async loadMoreFeedItems(
    request: LoadMoreItemsRequest
  ): Promise<LoadMoreItemsResponse> {
    const endpoint = "/loadfeed";
    const repsonse: JSON =
      await this.clientCommunicator.doPost<LoadMoreItemsRequest>(
        request,
        endpoint
      );

    return LoadMoreItemsResponse.fromJson(repsonse);
  }

  async loadMoreUsers(request: LoadMoreUsersRequest) {
    const endpoint = "/loadusers";
    const response: JSON =
      await this.clientCommunicator.doPost<LoadMoreUsersRequest>(
        request,
        endpoint
      );

    return LoadMoreUsersResponse.fromJson(response);
  }
}
