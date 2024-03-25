import {
  AuthToken,
  GetFollowCountRequest,
  LoadMoreUsersRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("ServerFacade", () => {
  //   let server: ServerFacade;

  //   beforeEach(() => {
  //     server = new ServerFacade();
  //   });

  it("lets a user register", async () => {
    const request = new RegisterRequest("a", "a", "a", "a", "url");
    const server = new ServerFacade();

    const response = await server.register(request);

    expect(response.message).toBeNull();
    expect(response.success).toBe(true);
    expect(response.token).toBeTruthy();
    expect(response.user).toBeTruthy();
  });

  it("gets a user's followers", async () => {
    const server = new ServerFacade();

    const token = new AuthToken("12345", 10);
    const user = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );
    const request = new LoadMoreUsersRequest(
      "a",
      token,
      user,
      null,
      5,
      "followers"
    );
    const response = await server.loadMoreUsers(request);

    expect(response.hasMoreItems).toBe(true);
    expect(response.message).toBeNull();
    expect(response.success).toBe(true);
    expect(response.itemsList).toBeTruthy();
  });

  it("get a user's followers count", async () => {
    const server = new ServerFacade();
    const token = new AuthToken("12345", 10);
    const user = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );

    const request = new GetFollowCountRequest("a", token, user, "followers");
    const response = await server.getFollowCount(request);

    expect(response.count).toBeTruthy();
    expect(response.message).toBeNull();
    expect(response.success).toBe(true);
  });
});
