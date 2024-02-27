import { AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter {
  private service: LoginService;

  public constructor(view: LogoutView) {
    super(view);
    this.service = new LoginService();
  }

  protected get view(): LogoutView {
    return super.view as LogoutView;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
