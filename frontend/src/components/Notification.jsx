import PropTypes from "prop-types";
import "./notification.css";

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  const className = notification.type === "error" ? "error" : "success";

  return (
    <div className={className} data-cy="notification">
      {notification.message}
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    type: PropTypes.oneOf(["error", "success"]),
    message: PropTypes.string.isRequired,
  }),
};

export default Notification;
