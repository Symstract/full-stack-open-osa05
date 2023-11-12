import PropTypes from "prop-types";
import Blog from "./Blog";

const BlogList = ({ blogs, user, addLike, deleteBlog }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addLike={addLike}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default BlogList;
