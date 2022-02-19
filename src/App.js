import "./App.css";

import { Outlet, Route, Routes } from "react-router-dom";

import EditProfile from "./components/Profile/EditProfile";
import Header from "./components/Nav/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./components/Profile/Profile";
import React from "react";
import Register from "./pages/Register";
import Users from "./components/Users/Users";

export default function App() {
  const PageLayout = () => (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username/:id" element={<Profile />} />
        <Route path="/explore/people/" element={<Users />} />
        <Route path="/accounts/edit/" element={<EditProfile />} />
      </Routes>
      <Outlet />
    </div>
  );

  return (
    <Routes>
      <Route path="/*" element={<PageLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
