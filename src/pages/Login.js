import "./Login.css";

import { Button, Col, Form, Input, Row } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { auth, db } from "../Firebase/firebase-config";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { user } = userCredential;
        let check = await checkUserExist(user.uid);
        if (!check) {
          await insertUser(user);
        }
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (userCredential) => {
        const { user } = userCredential;
        let check = await checkUserExist(user.uid);
        if (!check) {
          await insertUser(user);
        }
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const insertUser = async (user) => {
    await setDoc(doc(db, "users", user.uid), {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      providerId: user.providerId,
      uid: user.uid,
      followers: [],
      following: [],
      createdAt: serverTimestamp(),
    });
  };

  const checkUserExist = async (uid) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const data = await getDocs(q);
    return data.docs.length > 0;
  };

  return (
    <div style={{ background: "#fafafa" }}>
      <Row>
        <Col span={12} style={{ textAlign: "end" }}>
          <img
            src="https://www.instagram.com/static/images/homepage/home-phones@2x.png/9364675fb26a.png"
            style={{ objectFit: "contain" }}
            height="618px"
            width="418px"
            alt=""
          ></img>

          <div style={{ margin: "-503px 56px 0px 151px" }}>
            <img
              alt=""
              height={397}
              width={225}
              src="https://www.instagram.com/static/images/homepage/screenshot1-2x.jpg/9144d6673849.jpg"
            />
            {/* <img
              alt=""
              class="RP4i1  "
              src="/static/images/homepage/screenshot2-2x.jpg/177140221987.jpg"
            />
            <img
              alt=""
              class="RP4i1  "
              src="/static/images/homepage/screenshot3-2x.jpg/ff2c097a681e.jpg"
            />
            <img
              alt=""
              class="RP4i1  "
              src="/static/images/homepage/screenshot4-2x.jpg/b27a108592d8.jpg"
            />
            <img
              alt=""
              class="RP4i1  UVauz"
              src="/static/images/homepage/screenshot5-2x.jpg/5e04169b9308.jpg"
            /> */}
          </div>
        </Col>

        <Col span={12} style={{ paddingTop: 100 }}>
          <div className="formLogin">
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                style={{ objectFit: "contain" }}
                alt=""
                height={80}
                width={150}
              ></img>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              autoComplete="off"
              style={{ width: 250 }}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  onClick={signIn}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
            <p>----------------- HOẶC -----------------</p>
            <button
              className="login-with-google-btn"
              onClick={signInWithGoogle}
            >
              Đăng nhập bằng Google
            </button>
            <br />
          </div>
          {/* <div className="register">
            Bạn chưa có tài khoản ư? <Link to="/register">Đăng ký</Link>
          </div> */}
        </Col>
      </Row>
    </div>
  );
}

export default Login;
