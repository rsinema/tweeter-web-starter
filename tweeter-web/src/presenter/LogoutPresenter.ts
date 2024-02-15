import { AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";

export interface LogoutView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined
  ) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined
  ) => void;
}

export class LogoutPresenter {
  private view: LogoutView;
  private service: LoginService;

  public constructor(view: LogoutView) {
    this.view = view;
    this.service = new LoginService();
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
