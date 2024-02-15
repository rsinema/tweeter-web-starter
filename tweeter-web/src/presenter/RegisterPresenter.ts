import { User, AuthToken } from "tweeter-shared";
import { RegisterService } from "../model/service/RegisterService";
import { Buffer } from "buffer";

export interface RegisterView {
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
  setImageUrl: (url: string) => void;
  setImageBytes: (image: Uint8Array) => void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private service: RegisterService;

  public constructor(view: RegisterView) {
    this.view = view;
    this.service = new RegisterService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    rememberMeRefVal: boolean
  ) {
    try {
      let [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes
      );

      this.view.updateUserInfo(user, user, authToken, rememberMeRefVal);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    }
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
