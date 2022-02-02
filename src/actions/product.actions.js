import axios from "../helpers/axios";
import { productConstants } from "./constants";
const initParams = {
  page: 1,
  pageSize: 8,
  from: 0,
  to: 0,
};
const ORDER_OPTIONS = [
  {
    value: "newest",
    name: "Newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "priceLowToHigh",
    name: "Price - Low to high",
    sortBy: "salePrice",
    sortOrder: "asc",
  },
  {
    value: "priceHighToLow",
    name: "Price - High to low",
    sortBy: "salePrice",
    sortOrder: "desc",
  },
];
export const getByQuery = (params, size = initParams.pageSize) => {
  Object.keys(params).forEach(
    (key) =>
      (params[key] === undefined || params[key].length === 0) &&
      delete params[key]
  );
  const { page, pageSize, from, to, orderBy, ...dynamicParams } = {
    ...initParams,
    ...params,
    pageSize: size,
  };
  let price = "..";
  if (from && to) {
    price = `${from}..${to}`;
  } else if (from && !to) {
    price = `${from}..`;
  } else if (!from && to) {
    price = `..${to}`;
  }
  const sort = orderBy
    ? {
        sortOrder: ORDER_OPTIONS.find((x) => x.value === orderBy).sortOrder,
        sortBy: ORDER_OPTIONS.find((x) => x.value === orderBy).sortBy,
      }
    : {
        sortOrder: ORDER_OPTIONS[0].sortOrder,
        sortBy: ORDER_OPTIONS[0].sortBy,
      };
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCT_BY_QUERY_REQUEST });
      const res = await axios.get(`products/search/${page}/${pageSize}`, {
        params: { ...dynamicParams, salePrice: price, ...sort },
      });
      const result = {
        ...res.data.data,
        products: res.data.data.products.map((product) => ({
          ...product,
          price: product.salePrice,
        })),
      };
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getBySearch = (params, size = initParams.pageSize) => {
  const sort = params.orderBy
    ? {
        sortOrder: ORDER_OPTIONS.find((x) => x.value === params.orderBy)
          .sortOrder,
        sortBy: ORDER_OPTIONS.find((x) => x.value === params.orderBy).sortBy,
      }
    : {
        sortOrder: ORDER_OPTIONS[0].sortOrder,
        sortBy: ORDER_OPTIONS[0].sortBy,
      };
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCT_BY_QUERY_REQUEST });
      const res = await axios.get(`products/search/${params.page}/${8}`, {
        params: { q: params.q, ...sort },
      });
      const result = {
        ...res.data.data,
        products: res.data.data.products.map((product) => ({
          ...product,
          price: product.salePrice,
        })),
      };
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getAll = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCT_BY_QUERY_REQUEST });
      const res = await axios.get(`products`);
      const result = {
        ...res.data.data,
        products: res.data.data.products.map((product) => ({
          ...product,
          price: product.salePrice,
        })),
      };
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getBySlug = (slug) => {
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCT_BY_SLUG_REQUEST });
      const res = await axios.get(`products/${slug}`);
      const products = res.data.data.map((product) => ({
        ...product,
        price: product.salePrice,
        productPictures: product.productPictures,
      }));
      dispatch({
        type: productConstants.GET_PRODUCT_BY_SLUG_SUCCESS,
        payload: { products },
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_BY_SLUG_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
// export const getProductPage = (params) => {
//   return async (dispatch) => {
//     try {
//       const { categoryId, type } = params;
//       dispatch({ type: productConstants.GET_PAGE_REQUEST });
//       const res = await axios.get(`page/${categoryId}/${type}`);
//       if (res.status === 200) {
//         dispatch({
//           type: productConstants.GET_PAGE_SUCCESS,
//           payload: { page: res.data.page },
//         });
//       } else {
//         dispatch({
//           type: productConstants.GET_PAGE_FAILURE,
//           payload: { error: res.data.error },
//         });
//       }
//     } catch (error) {
//       dispatch({
//         type: productConstants.GET_PAGE_FAILURE,
//         payload: { error },
//       });
//     }
//   };
// };

export const getProductById = (params) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.GET_DETAIL_REQUEST });
    let res;
    try {
      const { id } = params;
      res = await axios.get(`product/${id}`);
      const productDetails = {
        ...res.data.data,
        price: res.data.data.salePrice,
      };
      dispatch({
        type: productConstants.GET_DETAIL_SUCCESS,
        payload: { productDetails },
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_DETAIL_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
