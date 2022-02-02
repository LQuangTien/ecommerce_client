import { cartConstants } from "../actions/constants";

const initState = {
  cartItems: {},

  getting: false,
  updating: false,
  deleting: false,
  error: null,
};
const cartReducer = (state = initState, action) => {
  switch (action.type) {
    case cartConstants.GET_CART_REQUEST:
      state = {
        ...state,
        getting: true,
      };
      break;
    case cartConstants.GET_CART_SUCCESS:
      state = {
        ...state,
        cartItems: action.payload.cartItems,
        getting: false,
      };
      break;
    case cartConstants.GET_CART_FAILURE:
      state = {
        ...state,
        getting: false,
        error: action.payload.error,
      };
      break;
    case cartConstants.ADD_TO_CART_REQUEST:
      state = {
        ...state,
        updating: true,
      };
      break;
    case cartConstants.ADD_TO_CART_SUCCESS:
      state = {
        ...state,
        cartItems: action.payload.cartItems,
        updating: false,
      };
      break;
    case cartConstants.ADD_TO_CART_FAILURE:
      state = {
        ...state,
        updating: false,
        cartItems: {},
        error: action.payload.error,
      };
      break;
    case cartConstants.DELETE_CART_ITEM_REQUEST:
      state = {
        ...state,
        deleting: true,
      };
      break;
    case cartConstants.DELETE_CART_ITEM_SUCCESS:
      state = {
        ...state,
        cartItems: action.payload.cartItems,
        deleting: false,
      };
      break;
    case cartConstants.DELETE_CART_ITEM_FAILURE:
      state = {
        ...state,
        deleting: false,
        error: action.payload.error,
      };
      break;
    case cartConstants.RESET_CART:
      state = { ...initState, cartItems: {} };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};
export default cartReducer;
