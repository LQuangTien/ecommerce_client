import { userConstants } from "../actions/constants";

const initState = {
  address: [],
  loading: false,
  orders: [],
  loadingOrder: false,
  loadingAddOrder: false,
  order: {},
  loadingDetail: false,
  error: null,
  redirectUrl: "",
  apptransid: "",
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case userConstants.GET_ADDRESS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.GET_ADDRESS_SUCCESS:
      state = {
        ...state,
        loading: false,
        address: action.payload.address,
      };
      break;
    case userConstants.GET_ADDRESS_FAILURE:
      state = {
        ...state,
        loading: false,
        address: [],
        error: action.payload.error,
      };
      break;
    case userConstants.ADD_ADDRESS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.ADD_ADDRESS_SUCCESS:
      state = {
        ...state,
        address: action.payload.address,
        loading: false,
      };
      break;
    case userConstants.ADD_ADDRESS_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    case userConstants.UPDATE_ADDRESS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.UPDATE_ADDRESS_SUCCESS:
      state = {
        ...state,
        address: action.payload.address,
        loading: false,
      };
      break;
    case userConstants.UPDATE_ADDRESS_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    case userConstants.GET_ORDER_REQUEST:
      state = {
        ...state,
        loadingOrder: true,
      };
      break;
    case userConstants.GET_ORDER_SUCCESS:
      state = {
        ...state,
        loadingOrder: false,
        orders: action.payload.orders,
      };
      break;
    case userConstants.GET_ORDER_FAILURE:
      state = {
        ...state,
        loadingOrder: false,
        orders: [],
        error: action.payload.error,
      };
      break;
    case userConstants.ADD_ORDER_REQUEST:
      state = {
        ...state,
        loadingAddOrder: true,
      };
      break;
    case userConstants.ADD_ORDER_SUCCESS:
      state = {
        ...state,
        loadingAddOrder: false,
        orders: [...state.orders, action.payload.order],
        redirectUrl: action.payload.redirectUrl ?? "",
        apptransid: action.payload.apptransid ?? "",
      };
      break;
    case userConstants.ADD_ORDER_FAILURE:
      state = {
        ...state,
        loadingAddOrder: false,
        orders: [],
        error: action.payload.error,
      };
      break;
    case userConstants.GET_ORDER_DETAIL_REQUEST:
      state = {
        ...state,
        loadingDetail: true,
      };
      break;
    case userConstants.GET_ORDER_DETAIL_SUCCESS:
      state = {
        ...state,
        loadingDetail: false,
        order: action.payload.order,
      };
      break;
    case userConstants.GET_ORDER_DETAIL_FAILURE:
      state = {
        ...state,
        loadingDetail: false,
        order: {},
        error: action.payload.error,
      };
      break;
    case userConstants.RESET_USER:
      state = {
        ...initState,
      };
      break;
    default:
      break;
  }
  return state;
};
export default userReducer;
