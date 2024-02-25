import { User, AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter extends Presenter {
  private service: LoginService;

  public constructor(view: LoginView) {
    super(view);
    this.service = new LoginService();
  }

  protected get view(): LoginView {
    return super.view as LoginView;
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
