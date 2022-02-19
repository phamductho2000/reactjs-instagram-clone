import { Avatar, Button, List, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";

import { Link } from "react-router-dom";
import { db } from "../../Firebase/firebase-config";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const getSuggestUsers = async () => {
      const data = await getDocs(q);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getSuggestUsers();
  }, []);

  return (
    <div style={{ width: "50%", padding: 20, margin: "120px auto 0px" }}>
      <Typography.Title level={5}>Danh sách người dùng</Typography.Title>
      <div
        style={{
          background: "#ffffff",
          padding: 20,
          border: "1px solid lightgray",
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={users}
          split={false}
          grid={{ column: 1, gutter: 5 }}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={user.photoURL} />}
                title={
                  <Link
                    to={`/profile/${user.displayName}/${user.uid}`}
                    style={{ color: "black" }}
                  >
                    {user.displayName}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
