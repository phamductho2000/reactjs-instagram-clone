import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import AppProvider from "./context/AppProvider";
import UploadImageModal from "./components/Modal/UploadImageModal";
import WriteCaptionModal from "./components/Modal/WriteCaptionModal";
import DetailPostModal from "./components/Modal/DetailPostModal";

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <App />
        <UploadImageModal />
        <WriteCaptionModal />
        <DetailPostModal />
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
