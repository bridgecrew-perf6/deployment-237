import { combineReducers } from "redux";
import { moviesReducer, userReducer } from "./product-reducer";

const reducers = combineReducers({
  userData: userReducer,
  moviesData: moviesReducer,
});

export default reducers;
