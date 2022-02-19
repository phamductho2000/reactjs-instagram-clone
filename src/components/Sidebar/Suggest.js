import "./Suggest.css";
import "antd/dist/antd.css";

import { Avatar, List } from "antd";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { db } from "../../Firebase/firebase-config";

export default function Suggest() {
  const [suggestUsers, setSuggestUsers] = useState([]);

  const {
    user: { displayName, photoURL, uid },
  } = useContext(AuthContext);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const getSuggestUsers = async () => {
      const data = await getDocs(q);
      setSuggestUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getSuggestUsers();
  }, []);

  const handleClickFollow = async (e) => {
    var uidFollower = e.target.id;
    await updateDoc(doc(db, "users", uidFollower), {
      followers: arrayUnion({ username: displayName, uid: uid }),
    });
    var username = await getUserById(uid);
    await updateDoc(doc(db, "users", uid), {
      following: arrayUnion({
        username: username.displayName,
        uid: uidFollower,
      }),
    });
  };

  const getUserById = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  };

  return (
    <div className="suggest">
      <div className="suggest_user">
        <Avatar className="post_avatar" alt="Thọ" src={photoURL} size={55} />
        <Link
          to={`/profile/${displayName}/${uid}`}
          style={{ fontWeight: 600, color: "black" }}
        >
          {displayName}
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "20%",
        }}
      >
        <p style={{ fontWeight: 600, color: "#7b7b7b" }}>Gợi ý cho bạn</p>
        <Link to="/explore/people">Xem tất cả</Link>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={suggestUsers.slice(0, 6)}
        split={false}
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
  );
}
