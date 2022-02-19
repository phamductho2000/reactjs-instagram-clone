import React, { useState } from "react";
import "./Login.css";
import { Input, Button, Form, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../Firebase/firebase-config";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const signUp = (e) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const {
          user: { uid },
        } = userCredential;
        await setDoc(doc(db, "users", uuidv4()), {
          displayName: fullName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          providerId: userCredential.user.providerId,
          uid: uid,
          followers: [],
          following: [],
          createdAt: serverTimestamp(),
        });
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <center>
      <div className="formLogin" style={{ marginTop: 20 }}>
        <div>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
            style={{ objectFit: "contain" }}
            alt=""
            height={80}
            width={150}
          ></img>
        </div>
        <div>Đăng nhập bằng facebook</div>
        <Divider>HOẶC</Divider>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          style={{ width: 250 }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Nhập email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Please input your fullname!" }]}
          >
            <Input
              placeholder="Nhập tên"
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              onClick={signUp}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: "center", margin: "10px 30px" }}>
          Bằng cách đăng ký, bạn đồng ý với Điều khoản, Chính sách dữ liệu và
          Chính sách cookie của chúng tôi.
        </p>
      </div>
      <div className="register">
        Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </div>
    </center>
  );
}

export default Register;
