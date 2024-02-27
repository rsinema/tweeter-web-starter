import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { UserItemView } from "./presenter/UserItemPresenter";
import { StatusItemView } from "./presenter/StatusItemPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { RegisterPresenter, RegisterView } from "./presenter/RegisterPresenter";
import { AuthenticationView } from "./presenter/AuthenticationPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller
              key={"feed"}
              presenterGenerator={(view: StatusItemView) =>
                new FeedPresenter(view)
              }
              itemComponentGenerator={function (item: Status): JSX.Element {
                return <StatusItem value={item} />;
              }}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={"story"}
              presenterGenerator={(view: StatusItemView) =>
                new FeedPresenter(view)
              }
              itemComponentGenerator={function (item: Status): JSX.Element {
                return <StatusItem value={item} />;
              }}
            />
          }
        />
        <Route
          path="following"
          element={
            <ItemScroller
              key={"following"}
              presenterGenerator={(view: UserItemView) =>
                new FollowingPresenter(view)
              }
              itemComponentGenerator={function (item: User): JSX.Element {
                return <UserItem value={item} />;
              }}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={"followers"}
              presenterGenerator={(view: UserItemView) =>
                new FollowingPresenter(view)
              }
              itemComponentGenerator={function (item: User): JSX.Element {
                return <UserItem value={item} />;
              }}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterGenerator={(view: AuthenticationView) =>
              new LoginPresenter(view)
            }
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            presenterGenerator={(view: RegisterView) =>
              new RegisterPresenter(view)
            }
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            originalUrl={location.pathname}
            presenterGenerator={(view: AuthenticationView) =>
              new LoginPresenter(view)
            }
          />
        }
      />
    </Routes>
  );
};

export default App;
