import { User, AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";

export interface LoginView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined
  ) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter {
  private view: LoginView;
  private service: LoginService;

  public constructor(view: LoginView) {
    this.view = view;
    this.service = new LoginService();
  }

  public async doLogin(
    originalUrl: string | undefined,
    alias: string,
    password: string,
    rememberMeRefVal: boolean
  ) {
    try {
      let [user, authToken] = await this.service.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, rememberMeRefVal);
      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }
}
