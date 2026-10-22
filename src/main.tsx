// ==============================================================
// MỤC ĐÍCH: Kết nối React với file HTML. (Không chứa logic app).
// ==============================================================
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ReactDOM.createRoot: Tìm thẻ <div id="root"> trong index.html để "bơm" App vào.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* Render Component App */}
    <App />
  </React.StrictMode>
);