import { authConstants } from "../actions/constants";

const initState = {
  token: null,
  user: { firstName: "", lastName: "", email: "", picture: "", fullName: "" },
  authenticate: false,
  authenticating: false,
  loading: false,
  error: null,
  message: "",
  signuping: false,
  signupError: "",
  signUpSuccessMessage: null,
  isForgotPassword: false,
  forgotPasswordError: null,
  isChangePassword: false,
  changePasswordError: null,
  showLoginModal: false,
  isActiving: false,
  activeSuccessMessage: null,
  activeErrorMessage: null,
};
const authReducer = (state = initState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      state = {
        ...state,
        authenticating: true,
      };
      break;
    case authConstants.LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
      };
      break;
    case authConstants.LOGIN_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
        authenticating: false,
      };
      break;
    case authConstants.SIGNUP_REQUEST:
      state = {
        ...state,
        signuping: true,
        signupError: null,
        signUpSuccessMessage: null,
      };
      break;
    case authConstants.SIGNUP_SUCCESS:
      state = {
        ...state,
        signUpSuccessMessage: action.payload.signUpSuccessMessage,
        // user: action.payload.user,
        // token: action.payload.token,
        // authenticate: true,
        signuping: false,
        signupError: null,
      };
      break;
    case authConstants.SIGNUP_FAILURE:
      state = {
        ...state,
        signupError: action.payload.error,
        signuping: false,
      };
      break;
    case authConstants.GOOGLE_SIGN_IN_REQUEST:
      state = {
        ...state,
        authenticating: true,
      };
      break;
    case authConstants.GOOGLE_SIGN_IN_SUCCESS:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
      };
      break;
    case authConstants.GOOGLE_SIGN_IN_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        authenticating: false,
      };
      break;
    case authConstants.LOGOUT_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case authConstants.LOGOUT_SUCCESS:
      state = {
        ...initState,
      };
      break;
    case authConstants.LOGOUT_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };
      break;
    case authConstants.FORGOT_PASSWORD_REQUEST:
      state = {
        ...state,
        isForgotPassword: true,
        forgotPasswordError: null,
      };
      break;
    case authConstants.FORGOT_PASSWORD_SUCCESS:
      state = {
        ...state,
        isForgotPassword: false,
        forgotPasswordError: null,
      };
      break;
    case authConstants.FORGOT_PASSWORD_FAILURE:
      state = {
        ...state,
        isForgotPassword: false,
        forgotPasswordError: action.payload.error,
      };
      break;
    case authConstants.CHANGE_PASSWORD_REQUEST:
      state = {
        ...state,
        isChangePassword: true,
      };
      break;
    case authConstants.CHANGE_PASSWORD_SUCCESS:
      state = {
        ...state,
        isChangePassword: false,
      };
      break;
    case authConstants.CHANGE_PASSWORD_FAILURE:
      state = {
        ...state,
        isChangePassword: false,
        changePasswordError: action.payload.error,
      };
      break;
    case authConstants.SHOW_LOGIN_MODAL:
      state = {
        ...state,
        showLoginModal: true,
      };
      break;
    case authConstants.CLOSE_LOGIN_MODAL:
      state = {
        ...state,
        showLoginModal: false,
      };
      break;
    case authConstants.ACTIVE_ACCOUNT_REQUEST:
      state = {
        ...state,
        isActiving: true,
        activeSuccessMessage: null,
        activeErrorMessage: null,
      };
      break;
    case authConstants.ACTIVE_ACCOUNT_SUCCESS:
      state = {
        ...state,
        isActiving: false,
        activeSuccessMessage: action.payload.activeSuccessMessage,
        activeErrorMessage: null,
      };
      break;
    case authConstants.ACTIVE_ACCOUNT_FAILURE:
      state = {
        ...state,
        isActiving: false,
        activeSuccessMessage: null,
        activeErrorMessage: action.payload.activeErrorMessage,
      };
      break;
    default:
      break;
  }
  return state;
};
export default authReducer;
