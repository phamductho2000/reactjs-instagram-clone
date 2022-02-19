import React from "react";
import Post from "../components/Post/Post";
import Suggest from "../components/Sidebar/Suggest";
import { Row, Col, Spin } from "antd";
import { useState, useEffect } from "react";
import { db } from "../Firebase/firebase-config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribed = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setIsLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return (
    <Row style={{ marginTop: 60 }}>
      <Col
        span={15}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        {isLoading ? (
          <div
            style={{
              height: "100%",
              marginTop: 100,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </Col>
      <Col span={9}>
        <Suggest />
      </Col>
    </Row>
  );
}
