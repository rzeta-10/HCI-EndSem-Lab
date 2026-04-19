import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { QuickBiteProvider } from "./context/QuickBiteContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QuickBiteProvider>
        <App />
      </QuickBiteProvider>
    </BrowserRouter>
  </React.StrictMode>
);
