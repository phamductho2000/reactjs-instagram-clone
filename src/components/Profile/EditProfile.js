import { Avatar, Button, Form, Input, Typography, Upload } from "antd";
import React, { useContext } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { AuthContext } from "../../context/AuthProvider";
import AvatarEditor from "react-avatar-editor";
import { db } from "../../Firebase/firebase-config";

export default function EditProfile() {
  const {
    user: { displayName, photoURL, uid, email },
  } = useContext(AuthContext);

  const onFinish = async (values) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      displayName: values.username,
      email: values.email,
    });
    console.log(values);
    alert("Cập nhật thành công");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        width: "50%",
        padding: 20,
        margin: "120px auto 0px",
      }}
    >
      <Typography.Title level={5}>Chỉnh sửa trang cá nhân</Typography.Title>
      <div style={{ padding: 30, background: "#ffffff" }}>
        <div
          style={{
            width: "60%",
            margin: "20px auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar size={64} src={photoURL}>
            {displayName}
          </Avatar>
          <div>
            <Typography.Text strong style={{ marginLeft: 20, fontSize: 20 }}>
              {displayName}
            </Typography.Text>
            <Upload>
              <Typography.Paragraph
                strong
                style={{ marginLeft: 20, color: "blue", cursor: "pointer" }}
              >
                Thay đổi ảnh đại diện
              </Typography.Paragraph>
            </Upload>
          </div>
        </div>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên"
            name="username"
            initialValue={displayName}
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            initialValue={email}
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
