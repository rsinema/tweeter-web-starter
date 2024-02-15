import { AuthToken, User } from "tweeter-shared";
import { UserNavigationService } from "../model/service/UserNavigationService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined
  ) => void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private service: UserNavigationService;

  public constructor(view: UserNavigationView) {
    this.view = view;
    this.service = new UserNavigationService();
  }

  public async navigateToUser(
    target: string,
    authToken: AuthToken,
    currentUser: User
  ) {
    try {
      let alias = this.extractAlias(target);

      let user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  private extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };
}
