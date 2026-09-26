import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';

// 👇 IMPORT CONTEXT
import { GeneralContextProvider } from "./components/GeneralContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GeneralContextProvider> {/* 🔥 THIS WAS MISSING */}
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </GeneralContextProvider>
  </React.StrictMode>
);