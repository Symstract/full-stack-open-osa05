import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import blogService from "../services/blogs";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const BlogSection = ({ user, addNotification }) => {
  const [blogs, setBlogs] = useState([]);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((blogA, blogB) => blogB.likes - blogA.likes);
      setBlogs(blogs);
    });
  }, []);

  const createBlog = async (blog) => {
    const { blog: newBlog, error } = await blogService.create(blog);

    if (error) {
      addNotification(error, "error");
      return;
    }

    blogFormRef.current.toggleVisibility();
    const newBlogWithUserName = { ...newBlog, user: { name: user.name } };
    setBlogs(blogs.concat(newBlogWithUserName));
    addNotification(
      `a new blog ${blog.title} by ${blog.author} added`,
      "success"
    );
  };

  const addLike = async (blog) => {
    const blogWithAddedLike = {
      ...blog,
      likes: blog.likes + 1,
    };
    const { blog: updatedBlog, error } = await blogService.update(
      blogWithAddedLike
    );

    if (error) {
      addNotification(error, "error");
      return;
    }

    const updatedBlogs = [...blogs].filter((b) => b.id !== blog.id);
    updatedBlogs.push({
      ...updatedBlog,
      user: { name: user.name },
    });
    updatedBlogs.sort((a, b) => b.likes - a.likes);

    setBlogs(updatedBlogs);
  };

  const deleteBlog = async (blog) => {
    const remove = confirm(`Remove ${blog.title} by ${blog.author}?`);

    if (!remove) {
      return;
    }

    const { error } = await blogService.remove(blog.id);

    if (error) {
      addNotification(error, "error");
      return;
    }

    setBlogs(blogs.filter((b) => b.id !== blog.id));
    addNotification(`Removed ${blog.title} by ${blog.author}`);
  };

  return (
    <div>
      <h2>blogs</h2>
      <Togglable ref={blogFormRef} buttonLabel="new blog">
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <br />
      <BlogList
        blogs={blogs}
        user={user}
        addLike={addLike}
        deleteBlog={deleteBlog}
      />
    </div>
  );
};

BlogSection.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

export default BlogSection;
