import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthenticationView } from "../../../presenter/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator: (view: AuthenticationView) => LoginPresenter;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: AuthenticationView = {
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    navigate: (url: string) => navigate(url),
  };

  const [presenter] = useState(
    props.presenter ?? props.presenterGenerator(listener)
  );

  const doLogin = async () => {
    presenter.doLogin(
      props.originalUrl,
      alias,
      password,
      rememberMeRef.current
    );
  };

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const onAliasEvent = (s: string) => {
    setAlias(s);
  };

  const onPasswordEvent = (s: string) => {
    setPassword(s);
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields
        setAlias={onAliasEvent}
        setPassword={onPasswordEvent}
        margin={true}
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;
