// import React from "react";
// import { MemoryRouter } from "react-router-dom";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import "@testing-library/jest-dom";
// import { anything, instance, mock, verify } from "ts-mockito";

// import Login from "../../../../src/components/authentication/login/Login";
// import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
// import { AuthenticationView } from "../../../../src/presenter/AuthenticationPresenter";

// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";

// library.add(fab);

// describe("Login Component", () => {
//   it("start with the sign-in button disabled", () => {
//     const { signInButton } = renderLoginAndGetElements("/");
//     expect(signInButton).toBeDisabled();
//   });

//   it("enables the sign-in button if both alias and password fields have test", async () => {
//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElements("/");

//     await user.type(aliasField, "a");
//     await user.type(passwordField, "a");

//     expect(signInButton).toBeEnabled();
//   });

//   it("disables sign-in button is either fields is clear", async () => {
//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElements("/");

//     await user.type(aliasField, "a");
//     await user.type(passwordField, "a");
//     expect(signInButton).toBeEnabled();

//     await user.clear(aliasField);
//     expect(signInButton).toBeDisabled();

//     await user.type(aliasField, "b");
//     expect(signInButton).toBeEnabled();

//     await user.clear(passwordField);
//     expect(signInButton).toBeDisabled();
//   });

//   it("calls the presenter's login method with the correct parameters when the login button is pressed", async () => {
//     const mockPresenter = mock<LoginPresenter>();
//     const mockPresenterInstance = instance(mockPresenter);

//     const orginalUrl = "/";
//     const alias = "a";
//     const password = "b";
//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElements(orginalUrl, mockPresenterInstance);

//     await user.type(aliasField, alias);
//     await user.type(passwordField, password);

//     await user.click(signInButton);

//     verify(
//       mockPresenter.doLogin(orginalUrl, alias, password, anything())
//     ).once();
//   });
// });

// const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
//   return render(
//     <MemoryRouter>
//       {!!presenter ? (
//         <Login
//           originalUrl={originalUrl}
//           presenterGenerator={(view: AuthenticationView) =>
//             new LoginPresenter(view)
//           }
//           presenter={presenter}
//         />
//       ) : (
//         <Login
//           originalUrl={originalUrl}
//           presenterGenerator={(view: AuthenticationView) =>
//             new LoginPresenter(view)
//           }
//         />
//       )}
//     </MemoryRouter>
//   );
// };

// const renderLoginAndGetElements = (
//   orginalUrl: string,
//   presenter?: LoginPresenter
// ) => {
//   const user = userEvent.setup();

//   renderLogin(orginalUrl, presenter);

//   const signInButton = screen.getByRole("button", { name: /Sign in/i });
//   const aliasField = screen.getByLabelText("alias");
//   const passwordField = screen.getByLabelText("password");

//   return { signInButton, aliasField, passwordField, user };
// };
