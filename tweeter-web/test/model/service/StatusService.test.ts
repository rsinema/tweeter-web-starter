import { AuthToken, User } from "tweeter-shared";

import { StatusService } from "../../../src/model/service/StatusService";

describe("StatusService", () => {
  it("gets a page of a user's story", async () => {
    const token = new AuthToken("12345", 10);
    const service = new StatusService();
    const user = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );

    const [storyList, hasMoreItems] = await service.loadMoreStoryItems(
      token,
      user,
      10,
      null
    );

    expect(storyList).toBeTruthy();
    expect(hasMoreItems).toBe(true);
  });
});
