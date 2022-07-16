import axios from "../helpers/axios";
import { cartConstants, userConstants } from "./constants";
export const getAddress = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.GET_ADDRESS_REQUEST });
      const res = await axios.get("/user/address");
      const { address } = res.data.data;
      dispatch({
        type: userConstants.GET_ADDRESS_SUCCESS,
        payload: { address },
      });
    } catch (error) {
      dispatch({
        type: userConstants.GET_ADDRESS_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const addAddress = (adr) => {
  return async (dispatch) => {
    dispatch({ type: userConstants.ADD_ADDRESS_REQUEST });
    try {
      const res = await axios.post("/user/address/add", { address: adr });
      const { address } = res.data.data;
      dispatch({
        type: userConstants.ADD_ADDRESS_SUCCESS,
        payload: { address },
      });
    } catch (error) {
      dispatch({
        type: userConstants.ADD_ADDRESS_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const updateAddress = (adr) => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.UPDATE_ADDRESS_REQUEST });
      const res = await axios.put("/user/address/update", { address: adr });
      const { address } = res.data.data;
      dispatch({
        type: userConstants.UPDATE_ADDRESS_SUCCESS,
        payload: { address },
      });
    } catch (error) {
      dispatch({
        type: userConstants.UPDATE_ADDRESS_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const deleteAddress = (adr) => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.UPDATE_ADDRESS_REQUEST });
      const res = await axios.put("/user/address/delete", { address: adr });
      const { address } = res.data.data;
      dispatch({
        type: userConstants.UPDATE_ADDRESS_SUCCESS,
        payload: { address },
      });
    } catch (error) {
      dispatch({
        type: userConstants.UPDATE_ADDRESS_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getOrder = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.GET_ORDER_REQUEST });
      const res = await axios.get("/user/orders");
      if (res.status === 200) {
        const orders = res.data.data;
        dispatch({
          type: userConstants.GET_ORDER_SUCCESS,
          payload: { orders },
        });
      }
    } catch (error) {
      dispatch({
        type: userConstants.GET_ORDER_FAILURE,
        payload: { error },
      });
    }
  };
};
export const addOrder = (order) => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.ADD_ORDER_REQUEST });
      let res;
      if (order.paymentOption === "cod") {
        res = await axios.post("/user/order/add", order);
      } else if (order.paymentOption === "zalo") {
        res = await axios.post("/user/order/zaloPayment", order);
      }
      if (order.paymentOption === "cod") {
        const data = res.data.data;
        dispatch({
          type: userConstants.ADD_ORDER_SUCCESS,
          payload: { order: data },
        });
      } else {
        const { _doc, redirectUrl, apptransid } = res.data.data;
        axios.post("/user/order/getOrderStatus", {
          apptransid,
          orderId: _doc._id,
        });
        dispatch({
          type: userConstants.ADD_ORDER_SUCCESS,
          payload: { order: _doc, redirectUrl, apptransid },
        });
      }
      dispatch({ type: cartConstants.RESET_CART });
    } catch (error) {
      dispatch({
        type: userConstants.ADD_ORDER_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getOrderDetail = (_id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.GET_ORDER_DETAIL_REQUEST });
      const res = await axios.get(`/user/order/${_id}`);
      if (res.status === 200) {
        const order = res.data.data;
        dispatch({
          type: userConstants.GET_ORDER_DETAIL_SUCCESS,
          payload: { order },
        });
      }
    } catch (error) {
      dispatch({
        type: userConstants.GET_ORDER_DETAIL_FAILURE,
        payload: { error },
      });
    }
  };
};
