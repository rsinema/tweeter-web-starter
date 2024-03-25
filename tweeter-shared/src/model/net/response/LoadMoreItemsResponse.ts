import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { ResponseJson, TweeterResponse } from "./Response";

export class LoadMoreItemsResponse extends TweeterResponse {
  private _itemsList: Status[];
  private _hasMoreItems: boolean;

  constructor(
    success: boolean,
    itemsList: Status[],
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

  static fromJson(json: JSON): LoadMoreItemsResponse {
    interface LoadMoreItemsResponseJson extends ResponseJson {
      _itemsList: JSON[];
      _hasMoreItems: boolean;
    }

    const jsonObject: LoadMoreItemsResponseJson =
      json as unknown as LoadMoreItemsResponseJson;

    let items: Status[] = [];
    jsonObject._itemsList.forEach((element) => {
      const status = Status.fromJson(JSON.stringify(element));
      if (!!status) {
        items.push(status);
      }
    });

    return new LoadMoreItemsResponse(
      jsonObject._success,
      items,
      jsonObject._hasMoreItems,
      jsonObject._message
    );
  }
}
