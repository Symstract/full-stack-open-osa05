import axios from "axios";

const API = axios.create({
  baseURL: "/api/blogs",
});

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getConfig = () => {
  return {
    headers: { Authorization: token },
  };
};

const getAll = async () => {
  const request = API.get("/");
  const response = await request;
  return response.data;
};

const create = async (newBlog) => {
  try {
    const response = await API.post("/", newBlog, getConfig());
    return { blog: response.data, error: null };
  } catch (err) {
    console.log(err);
    return { blog: null, error: err.response.data.error };
  }
};

const update = async (updatedBlog) => {
  try {
    const response = await API.put(
      `/${updatedBlog.id}`,
      updatedBlog,
      getConfig()
    );
    return { blog: response.data, error: null };
  } catch (err) {
    console.log(err);
    return { blog: null, error: err.response.data.error };
  }
};

const remove = async (id) => {
  try {
    await API.delete(`/${id}`, getConfig());
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: err.response.data.error };
  }
};

export default { getAll, create, update, remove, setToken };
