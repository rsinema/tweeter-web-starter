import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { ResponseJson, TweeterResponse } from "./Response";

export class LoadMoreUsersResponse extends TweeterResponse {
  private _itemsList: User[];
  private _hasMoreItems: boolean;

  constructor(
    success: boolean,
    itemsList: User[],
    hasMoreItems: boolean,
    message: string | null
  ) {
    super(success, message);
    this._itemsList = itemsList;
    this._hasMoreItems = hasMoreItems;
  }

  get itemsList() {
    return this._itemsList;
  }

  get hasMoreItems() {
    return this._hasMoreItems;
  }

  static fromJson(json: JSON): LoadMoreUsersResponse {
    interface LoadMoreUsersResponseJson extends ResponseJson {
      _itemsList: JSON[];
      _hasMoreItems: boolean;
    }

    const jsonObject: LoadMoreUsersResponseJson =
      json as unknown as LoadMoreUsersResponseJson;

    let items: User[] = [];

    jsonObject._itemsList.forEach((element) => {
      const user = User.fromJson(JSON.stringify(element));
      if (!!user) {
        items.push(user);
      }
    });

    return new LoadMoreUsersResponse(
      jsonObject._success,
      items,
      jsonObject._hasMoreItems,
      jsonObject._message
    );
  }
}
