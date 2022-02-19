import { ActionTypes } from "../constants/action-types";

const initialState = {
  userData: [],
  moviesData: [],
};

export const productReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_PRODUCTS:
      return { ...state, products: payload };
    default:
      return state;
  }
};

export const moviesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_MOVIES_DATA:
      return { ...state, moviesData: payload };
    default:
      return state;
  }
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_USER_DATA:
      return { ...state, userData: payload };
    default:
      return state;
  }
};
