import axios from "axios";
import { api } from "../urlConfig";
import store from '../store'
import { signout } from "../actions";
const axiosInstance = axios.create({
  baseURL: api + "",
  headers: {
    Authorization: localStorage.getItem("token") || "",
  },
});
axiosInstance.interceptors.request.use((req) => {
  const { auth } = store.getState();
  if (auth.token) {
    req.headers.Authorization = `${auth.token}`;
  }
  return req;
});
axiosInstance.interceptors.response.use((res) => {
  return res;
}, (error) => {
  const { status } = error.response;
  if (status === 401) {
    axios.defaults.headers.common["Authorization"] = ""
    store.dispatch(signout());
  }
  return Promise.reject(error);
});
export default axiosInstance;
