import {
  AuthToken,
  LoadMoreItemsRequest,
  LoginRequest,
  TweeterRequest,
  User,
} from "tweeter-shared";

import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";

import { ServerFacade } from "../../src/network/ServerFacade";

import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";

describe("The application", () => {
  const test_username = "test";
  const test_password = "test";
  const test_post_text = "post";
  const server = new ServerFacade();
  let user: User;
  let authtoken: AuthToken;

  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;

  afterAll(async () => {
    const resp = await server.logout(new TweeterRequest(user.alias, authtoken));
  });

  beforeAll(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);
  });

  it("lets a user post and see the post on their story", async () => {
    const authResp = await server.login(
      new LoginRequest(test_username, test_password)
    );

    user = authResp.user;
    authtoken = authResp.token;

    await postStatusPresenter.submitPost(test_post_text, user, authtoken);

    const resp = await server.loadMoreStoryItems(
      new LoadMoreItemsRequest(user.alias, authtoken, user, null, 10)
    );

    expect(authResp.message).toBeNull();
    expect(authResp.success).toBe(true);
    expect(authResp.token).toBeTruthy();
    expect(authResp.user).toBeTruthy();

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once;

    expect(resp.success).toBeTruthy();
    expect(resp.itemsList[0].post).toBe(test_post_text);
    expect(resp.message).toBeNull();
  });
});
