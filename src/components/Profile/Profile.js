import "./Profile.css";
import "antd/dist/antd.css";

import { Avatar, Col, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { AppstoreOutlined } from "@ant-design/icons";
import MyPost from "./MyPost";
import { db } from "../../Firebase/firebase-config";
import { useParams } from "react-router-dom";

export default function Profile() {
  let { username, id } = useParams();
  const { TabPane } = Tabs;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("username", "==", username),
      orderBy("createdAt", "desc")
    );
    const unsubscribed = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setIsLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, [posts, username]);

  useEffect(() => {
    const getUser = async () => {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setIsLoading(false);
      } else {
        console.log("No such document!");
      }
    };
    getUser();
  }, [id]);

  return (
    <div className="profile">
      <div className="profile_header">
        <div className="profile_avatar">
          <Avatar alt="Thọ" src={user.photoURL} size={150} />
        </div>
        <div className="profile_info">
          <div style={{ display: "flex" }}>
            <div>
              <Typography.Title level={2}>{username}</Typography.Title>
            </div>
            {/* <div>
              <Button>Chỉnh sửa trang cá nhân</Button>
            </div> */}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <p style={{ fontSize: 16, marginRight: 40 }}>
              {posts.length} bài viết
            </p>
            <p style={{ fontSize: 16, marginRight: 40 }}>
              {user.followers === undefined ? 0 : user.followers.length} người
              theo dõi
            </p>
            <p style={{ fontSize: 16, marginRight: 40 }}>
              Đang theo dõi{" "}
              {user.following === undefined ? 0 : user.following.length} người
            </p>
          </div>
        </div>
      </div>
      <div style={{ height: 500 }}>
        <Tabs
          tabPosition="top"
          tabBarStyle={{ fontWeight: 400 }}
          size="small"
          defaultActiveKey="1"
          centered
        >
          <TabPane
            tab={
              <span>
                <AppstoreOutlined />
                BÀI VIẾT
              </span>
            }
            key="1"
          >
            {isLoading ? (
              <Spin
                style={{
                  position: "absolute",
                  left: "50%",
                }}
              />
            ) : posts.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  flexWrap: "wrap",
                }}
              >
                {posts.map((post) => (
                  <MyPost post={post} />
                ))}
              </div>
            ) : (
              <Row style={{ background: "#ffffff", marginTop: 20 }}>
                <Col span={12}>
                  <img
                    alt=""
                    height="100%"
                    width="100%"
                    src="https://www.instagram.com/static/images/mediaUpsell.jpg/6efc710a1d5a.jpg"
                  ></img>
                </Col>
                <Col span={12} style={{ textAlign: "center", bot: "50%" }}>
                  <div style={{ marginTop: "40%" }}>
                    <Typography.Title level={3}>
                      Bạn chưa có bài viết nào.
                    </Typography.Title>
                    <Typography.Title level={5}>
                      Bắt đầu ghi và chia sẻ khoảnh khắc của bạn.
                    </Typography.Title>
                  </div>
                </Col>
              </Row>
            )}
          </TabPane>
          {/* <TabPane
            tab={
              <span>
                <FlagOutlined />
                ĐÃ LƯU
              </span>
            }
            key="2"
          >
            Content of Tab Pane 2
          </TabPane>
          <TabPane
            tab={
              <span>
                <ContactsOutlined />
                ĐƯỢC GẮN THẺ
              </span>
            }
            key="3"
          >
            Content of Tab Pane 3
          </TabPane> */}
        </Tabs>
      </div>
    </div>
  );
}
