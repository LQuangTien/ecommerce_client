import axios from "../helpers/axios";
import { authConstants, cartConstants, userConstants } from "./constants";

export const login = (data) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    try {
      const res = await axios.post("signin", { ...data });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token, user },
      });
    } catch (error) {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const isUserLoggedIn = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token, user },
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: "" },
      });
      return;
    }
  };
};

export const signout = () => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_REQUEST });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: authConstants.LOGOUT_SUCCESS });
    dispatch({ type: cartConstants.RESET_CART });
    dispatch({ type: userConstants.RESET_USER });
  };
};

export const signup = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.SIGNUP_REQUEST });
      const res = await axios.post("/signup", data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: authConstants.SIGNUP_SUCCESS,
        payload: { token, user },
      });
    } catch (error) {
      dispatch({
        type: authConstants.SIGNUP_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};

export const forgotPassword = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.FORGOT_PASSWORD_REQUEST });
      await axios.post("/forget-password", { userEmail: data.email });
      dispatch({
        type: authConstants.FORGOT_PASSWORD_SUCCESS,
      });
    } catch (error) {
      console.log(error.response.data.error.error);
      dispatch({
        type: authConstants.FORGOT_PASSWORD_FAILURE,
        payload: { error: error.response.data.error.error },
      });
    }
  };
};

export const changePassword = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.CHANGE_PASSWORD_REQUEST });
      await axios.post("/change-password", data);
      dispatch({
        type: authConstants.CHANGE_PASSWORD_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: authConstants.CHANGE_PASSWORD_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
