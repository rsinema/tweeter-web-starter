import { AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter {
  private _service: LoginService | null = null;

  public constructor(view: AppNavbarView) {
    super(view);
  }

  protected get view(): AppNavbarView {
    return super.view as AppNavbarView;
  }

  public get service() {
    if (this._service == null) {
      this._service = new LoginService();
    }

    return this._service;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "log user out");
  }
}
