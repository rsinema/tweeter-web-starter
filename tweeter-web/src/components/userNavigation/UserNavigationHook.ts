import { AuthToken, User } from "tweeter-shared";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

interface UserNavigation {
  navigateToUser: (
    event: React.MouseEvent,
    currentUser: User | null,
    authToken: AuthToken | null
  ) => Promise<void>;
}

const useNavigateToUser = (
  setDisplayedUser: (user: User) => void,
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined
  ) => void
) => {
  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  };

  const presenter = new UserNavigationPresenter(listener);

  const navigateToUser = async (
    event: React.MouseEvent,
    currentUser: User | null,
    authToken: AuthToken | null
  ): Promise<void> => {
    event.preventDefault();
    presenter.navigateToUser(event.target.toString(), authToken!, currentUser!);
  };

  const defaultUserNavigation: UserNavigation = {
    navigateToUser: navigateToUser,
  };

  return defaultUserNavigation;
};

export default useNavigateToUser;
