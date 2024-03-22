import { UserService } from "../model/service/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<UserService> {
  protected createService(): UserService {
    return new UserService();
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
