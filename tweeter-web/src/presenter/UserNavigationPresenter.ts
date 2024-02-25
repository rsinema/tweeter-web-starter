import { AuthToken, User } from "tweeter-shared";
import { UserNavigationService } from "../model/service/UserNavigationService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter {
  private service: UserNavigationService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.service = new UserNavigationService();
  }

  protected get view(): UserNavigationView {
    return super.view as UserNavigationView;
  }

  public async navigateToUser(
    target: string,
    authToken: AuthToken,
    currentUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      let alias = this.extractAlias(target);

      let user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }

  private extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };
}
