import { RegisterService } from "../model/service/RegisterService";
import { Buffer } from "buffer";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void;
  setImageBytes: (image: Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterService> {
  protected createService(): RegisterService {
    return new RegisterService();
  }

  public constructor(view: RegisterView) {
    super(view);
  }

  protected get view(): RegisterView {
    return super.view as RegisterView;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    rememberMeRefVal: boolean
  ) {
    this.doFailureReportingOperation(async () => {
      let [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes
      );

      this.view.updateUserInfo(user, user, authToken, rememberMeRefVal);
      this.view.navigate("/");
    }, "register user");
  }

  public async handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }
}
