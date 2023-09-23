import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogSection from "./components/BlogSection";
import blogService from "./services/blogs";

const App = () => {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const logout = () => {
    window.localStorage.removeItem("loggedBlogListUser");
    setUser(null);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const addNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <>
      <Notification notification={notification} />
      {!user && (
        <LoginForm addNotification={addNotification} setUser={setUser} />
      )}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={logout}>Logout</button>
          </p>
        </div>
      )}
      {user && <BlogSection user={user} addNotification={addNotification} />}
    </>
  );
};

export default App;
