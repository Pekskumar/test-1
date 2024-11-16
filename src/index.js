import React from "react";
import ReactDOM from "react-dom/client";
// import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./ReduxTookit/Store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
