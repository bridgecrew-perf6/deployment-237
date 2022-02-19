import { ActionTypes } from "../constants/action-types";

export const setProducts = (products) => {
  return {
    type: ActionTypes.SET_PRODUCTS,
    payload: products,
  };
};

export const selectedProduct = (products) => {
  return {
    type: ActionTypes.SELECTED_PRODUCTS,
    payload: products,
  };
};

export const setMoviesData = (data) => {
  return {
    type: ActionTypes.SET_MOVIES_DATA,
    payload: data,
  };
};

export const setUserData = (data) => {
  return {
    type: ActionTypes.SET_USER_DATA,
    payload: data,
  };
};
