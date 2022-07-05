import axios from "../helpers/axios";
import { labelConstants } from "./constants";

export const getLabelById = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: labelConstants.GET_LABEL_DETAIL_REQUEST });
      const res = await axios.get(`/label/${id}`);
      if (res.status === 200) {
        const label = res.data.data;
        dispatch({
          type: labelConstants.GET_LABEL_DETAIL_SUCCESS,
          payload: { label },
        });
      }
    } catch (error) {
      dispatch({
        type: labelConstants.GET_LABEL_DETAIL_FAILURE,
        payload: { error },
      });
    }
  };
};

export const getLabels = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: labelConstants.GET_ALL_LABEL_REQUEST });
      const res = await axios.get(`/label`);
      if (res.status === 200) {
        const labels = res.data.data;
        dispatch({
          type: labelConstants.GET_ALL_LABEL_SUCCESS,
          payload: { labels },
        });
      }
    } catch (error) {
      dispatch({
        type: labelConstants.GET_ALL_LABEL_FAILURE,
        payload: { error },
      });
    }
  };
};
