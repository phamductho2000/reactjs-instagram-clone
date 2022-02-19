import "./Header.css";
import "antd/dist/antd.css";

import { Avatar, Button, Dropdown, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";

import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import SearchInput from "./SearchInput";
import { auth } from "../../Firebase/firebase-config";

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { setIsModalUploadImageVisible } = useContext(AppContext);
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`/profile/${user.displayName}/${user.uid}`}>
          Trang cá nhân
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/">Đã lưu</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/accounts/edit/">Cài đặt</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/">Chuyển tài khoản</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={() => auth.signOut()}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="app_header">
      <img
        className="app_headerImage"
        alt="Instagram"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      />
      <SearchInput />
      <div className="header_menu">
        <Button
          shape="circle"
          style={{ border: "none", marginLeft: 10 }}
          onClick={() => navigate("/")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/553/553376.png"
            width="24px"
            height="24px"
            alt=""
          ></img>
        </Button>
        <Button shape="circle" style={{ border: "none", marginLeft: 10 }}>
          <img src="/message.svg" width="24px" height="24px" alt=""></img>
        </Button>
        <Button
          shape="circle"
          style={{ border: "none", marginLeft: 10 }}
          onClick={() => setIsModalUploadImageVisible(true)}
        >
          <img src="/upload.svg" width="24px" height="24px" alt=""></img>
        </Button>
        <Button shape="circle" style={{ border: "none", marginLeft: 10 }}>
          <img src="/find.svg" width="24px" height="24px" alt=""></img>
        </Button>
        <Button shape="circle" style={{ border: "none", marginLeft: 10 }}>
          <img src="/love.svg" width="24px" height="24px" alt=""></img>
        </Button>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button shape="circle" style={{ border: "none", marginLeft: 10 }}>
            <Avatar src={user.photoURL} size={25} />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
