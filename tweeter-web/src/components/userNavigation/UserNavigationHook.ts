import { AuthToken, User, FakeData } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

const navigateToUser = async (
  event: React.MouseEvent,
  setDisplayedUser: (user: User) => void,
  currentUser: User | null,
  authToken: AuthToken | null,
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined
  ) => void
): Promise<void> => {
  event.preventDefault();

  try {
    let alias = extractAlias(event.target.toString());

    let user = await getUser(authToken!, alias);

    if (!!user) {
      if (currentUser!.equals(user)) {
        setDisplayedUser(currentUser!);
      } else {
        setDisplayedUser(user);
      }
    }
  } catch (error) {
    displayErrorMessage(`Failed to get user because of exception: ${error}`);
  }
};

const extractAlias = (value: string): string => {
  let index = value.indexOf("@");
  return value.substring(index);
};

const getUser = async (
  authToken: AuthToken,
  alias: string
): Promise<User | null> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.findUserByAlias(alias);
};

interface UserNavigation {
  navigateToUser: (
    event: React.MouseEvent,
    setDisplayedUser: (user: User) => void,
    currentUser: User | null,
    authToken: AuthToken | null,
    displayErrorMessage: (
      message: string,
      bootstrapClasses?: string | undefined
    ) => void
  ) => Promise<void>;
}

const defaultUserNavigation: UserNavigation = {
  navigateToUser: navigateToUser,
};

const useNavigateToUser = (): UserNavigation => defaultUserNavigation;

export default useNavigateToUser;
