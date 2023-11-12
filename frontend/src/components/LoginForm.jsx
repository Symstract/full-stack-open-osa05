import { useState } from "react";
import PropTypes from "prop-types";
import loginService from "../services/login";
import blogService from "../services/blogs";

const LoginForm = ({ setUser, addNotification }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const { user, error } = await loginService.login({ username, password });

    if (error) {
      addNotification(error, "error");
      return;
    }

    window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
    blogService.setToken(user.token);
    setUser(user);
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)}
            data-cy="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)}
            data-cy="password"
          />
        </div>
        <button type="submit" data-cy="login">
          login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

export default LoginForm;
