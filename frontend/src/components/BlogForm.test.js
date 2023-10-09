import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("BlogForm", () => {
  test("blog creation callback is called with correct parameters", async () => {
    const user = userEvent.setup();
    const createBlog = jest.fn();

    render(<BlogForm createBlog={createBlog} />);

    const title = "some title";
    const author = "some author";
    const url = "some url";

    const titleInput = screen.getByRole("textbox", { name: "title" });
    const authorInput = screen.getByRole("textbox", { name: "author" });
    const urlInput = screen.getByRole("textbox", { name: "url" });
    const createButton = screen.getByText("create");

    await user.type(titleInput, title);
    await user.type(authorInput, author);
    await user.type(urlInput, url);
    await user.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({ title, author, url });
  });
});
