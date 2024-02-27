import { LoginService } from "../model/service/LoginService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<LoginService> {
  protected createService(): LoginService {
    return new LoginService();
  }

  public constructor(view: AuthenticationView) {
    super(view);
  }

  protected get view(): AuthenticationView {
    return super.view as AuthenticationView;
  }

  public async doLogin(
    originalUrl: string | undefined,
    alias: string,
    password: string,
    rememberMeRefVal: boolean
  ) {
    this.doFailureReportingOperation(async () => {
      let [user, authToken] = await this.service.login(alias, password);
      let url: string;
      if (!!originalUrl) {
        url = originalUrl;
      } else {
        url = "/";
      }

      this.updateUserInfoAndNavigate(
        user,
        user,
        authToken,
        rememberMeRefVal,
        url
      );
    }, "login user");
  }
}
