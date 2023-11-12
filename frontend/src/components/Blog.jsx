import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, user, addLike, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggle = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div style={blogStyle} data-cy="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggle} data-cy="toggle">
          {showDetails ? "hide" : "view"}
        </button>
        {showDetails && (
          <div>
            <p>{blog.url}</p>
            <p>
              <span data-cy="likes">{blog.likes} </span>
              <button data-cy="like" onClick={() => addLike(blog)}>
                like
              </button>
            </p>
            <p>{blog.user.name}</p>
            {user.username === blog.user.username && (
              <button onClick={() => deleteBlog(blog)} data-cy="delete">
                remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
