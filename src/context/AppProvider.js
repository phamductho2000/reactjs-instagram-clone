import React, { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [isModalUploadImageVisible, setIsModalUploadImageVisible] =
    useState(false);
  const [isModalWriteCaptionVisible, setIsModalWriteCaptionVisible] =
    useState(false);
  const [isModalDetailPostVisible, setIsModalDetailPostVisible] =
    useState(false);
  const [post, setPost] = useState("");
  const [listImageUpload, setListImageUpload] = useState([]);

  return (
    <AppContext.Provider
      value={{
        isModalUploadImageVisible,
        setIsModalUploadImageVisible,
        isModalWriteCaptionVisible,
        setIsModalWriteCaptionVisible,
        listImageUpload,
        setListImageUpload,
        isModalDetailPostVisible,
        setIsModalDetailPostVisible,
        post,
        setPost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
