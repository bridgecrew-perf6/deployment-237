import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/main.css";
import "./assets/css/responsive.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>,
  document.getElementById("root")
);
