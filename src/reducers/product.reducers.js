import { productConstants } from "../actions/constants";

const initState = {
  products: [],
  loadingPage: false,
  page: {},
  error: null,
  productDetails: {},
  loading: false,
  totalPage: 0,
  product1: null,
  isGettingProduct1: false,
  product2: null,
  isGettingProduct2: false,
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    case productConstants.GET_PRODUCT_BY_QUERY_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case productConstants.GET_PRODUCT_BY_QUERY_SUCCESS:
      state = {
        ...state,
        products: action.payload.products,
        totalPage: action.payload.totalPage,
        loading: false,
      };
      break;
    case productConstants.GET_PRODUCT_BY_QUERY_FAILURE:
      state = {
        ...state,
        products: [],
        error: action.payload.error,
        totalPage: 0,
        loading: false,
      };
      break;
    case productConstants.GET_PRODUCT_BY_SLUG_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case productConstants.GET_PRODUCT_BY_SLUG_SUCCESS:
      state = {
        ...state,
        products: action.payload.products,
        loading: false,
      };
      break;
    case productConstants.GET_PRODUCT_BY_SLUG_FAILURE:
      state = {
        ...state,
        products: [],
        error: action.payload.error,
        loading: false,
      };
      break;
    case productConstants.GET_PAGE_REQUEST:
      state = {
        ...state,
        loadingPage: true,
      };
      break;
    case productConstants.GET_PAGE_SUCCESS:
      state = {
        ...state,
        loadingPage: false,
        page: action.payload.page,
      };
      break;
    case productConstants.GET_PAGE_FAILURE:
      state = {
        ...state,
        loadingPage: false,
        error: action.payload.error,
      };
      break;
    case productConstants.GET_DETAIL_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case productConstants.GET_DETAIL_SUCCESS:
      state = {
        ...state,
        loading: false,
        productDetails: action.payload.productDetails,
      };
      break;
    case productConstants.GET_DETAIL_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    case productConstants.GET_PRODUCT1_REQUEST:
      state = {
        ...state,
        isGettingProduct1: true,
        product2: null,
      };
      break;
    case productConstants.GET_PRODUCT1_SUCCESS:
      state = {
        ...state,
        isGettingProduct1: false,
        product1: action.payload.product1,
      };
      break;
    case productConstants.GET_PRODUCT1_FAILURE:
      state = {
        ...state,
        isGettingProduct1: false,
        error: action.payload.error,
      };
      break;
    case productConstants.GET_PRODUCT2_REQUEST:
      state = {
        ...state,
        isGettingProduct2: true,
      };
      break;
    case productConstants.GET_PRODUCT2_SUCCESS:
      state = {
        ...state,
        isGettingProduct2: false,
        product2: action.payload.product2,
      };
      break;
    case productConstants.GET_PRODUCT2_FAILURE:
      state = {
        ...state,
        isGettingProduct2: false,
        error: action.payload.error,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};
export default productReducer;
