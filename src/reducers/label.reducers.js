import { labelConstants } from "../actions/constants";

const initState = {
  labels: [],
  updating: false,
  label: null,
  loadingDetail: false,
  submitting: false,
  deleting: false,
};

const labelReducer = (state = initState, action) => {
  switch (action.type) {
    case labelConstants.GET_ALL_LABEL_SUCCESS:
      state = {
        ...state,
        labels: action.payload.labels,
      };
      break;
    case labelConstants.GET_LABEL_DETAIL_REQUEST:
      state = {
        ...state,
        loadingDetail: true,
      };
      break;
    case labelConstants.GET_LABEL_DETAIL_SUCCESS:
      state = {
        ...state,
        loadingDetail: false,
        label: action.payload.label,
      };
      break;
    case labelConstants.GET_LABEL_DETAIL_FAILURE:
      state = {
        ...state,
        loadingDetail: false,
        label: null,
        error: action.payload.error,
      };
      break;
    default:
      break;
  }
  return state;
};
export default labelReducer;
