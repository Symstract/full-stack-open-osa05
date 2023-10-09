import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("Blog", () => {
  const blog = {
    title: "some title",
    author: "some author",
    url: "some url",
    likes: 1,
    user: {
      name: "some name",
    },
  };

  test("initially renders title and author but not url and likes", () => {
    const addLike = jest.fn();
    const deleteBlog = jest.fn();

    render(<Blog blog={blog} addLike={addLike} deleteBlog={deleteBlog} />);

    screen.getByText(`${blog.title} ${blog.author}`);

    const url = screen.queryByText(blog.url);
    expect(url).toBeNull();

    const likes = screen.queryByText(blog.likes);
    expect(likes).toBeNull();
  });

  test("renders also url and likes when view button is clicked", async () => {
    const addLike = jest.fn();
    const deleteBlog = jest.fn();

    render(<Blog blog={blog} addLike={addLike} deleteBlog={deleteBlog} />);

    const user = userEvent.setup();
    const Viewbutton = screen.getByText("view");
    await user.click(Viewbutton);

    screen.getByText(blog.url);
    screen.getByText(blog.likes);
  });

  test("like callback is called twice when clicking like button twice", async () => {
    const addLike = jest.fn();
    const deleteBlog = jest.fn();

    render(<Blog blog={blog} addLike={addLike} deleteBlog={deleteBlog} />);

    const user = userEvent.setup();

    const Viewbutton = screen.getByText("view");
    await user.click(Viewbutton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(addLike.mock.calls).toHaveLength(2);
  });
});
