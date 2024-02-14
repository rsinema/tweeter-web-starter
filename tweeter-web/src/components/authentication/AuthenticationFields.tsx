interface Props {
  setAlias: (s: string) => void;
  setPassword: (s: string) => void;
  margin: boolean;
}

const AuthenticationFields = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className={`form-floating ${props.margin ? "mb-3" : ""}`}>
        <input
          type="password"
          className={`form-control ${props.margin ? "bottom" : ""}`}
          id="passwordInput"
          placeholder="Password"
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
