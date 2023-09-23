import axios from "axios";

const API = axios.create({
  baseURL: "/api/login",
});

const login = async (credentials) => {
  try {
    const response = await API.post("/", credentials);
    return { user: response.data, error: null };
  } catch (err) {
    console.log(err);
    return { user: null, error: "wrong credentials" };
  }
};

const loginService = { login };

export default loginService;
