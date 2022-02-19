import "./Post.css";
import "antd/dist/antd.css";

import React, { useContext, useEffect, useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

import { AppContext } from "../../context/AppProvider";
import { Button } from "antd";
import { db } from "../../Firebase/firebase-config";

function Action({ user, post }) {
  const { setPost, setIsModalDetailPostVisible } = useContext(AppContext);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    post.likes.map((item) => {
      item.username === user.displayName ? setIsLiked(true) : setIsLiked(false);
    });
  }, [post.likes, user.displayName]);

  const handleClickLiked = () => {
    if (isLiked) {
      setIsLiked(false);
      removeUserLiked();
    } else {
      setIsLiked(true);
      insertUserLiked();
    }
  };

  const insertUserLiked = async () => {
    await updateDoc(doc(db, "posts", post.id), {
      likes: arrayUnion({
        username: user.displayName,
      }),
    });
  };

  const removeUserLiked = async () => {
    await updateDoc(doc(db, "posts", post.id), {
      likes: arrayRemove({
        username: user.displayName,
      }),
    });
  };

  const showModalPostDetail = () => {
    setPost(post);
    setIsModalDetailPostVisible(true);
  };

  return (
    <div className="post_action">
      <Button
        shape="circle"
        style={{ border: "none", marginLeft: 10 }}
        onClick={handleClickLiked}
      >
        <img
          src={
            isLiked
              ? "https://cdn-icons-png.flaticon.com/512/2107/2107845.png"
              : "/love.svg"
          }
          width="24px"
          height="24px"
          alt=""
        ></img>
      </Button>
      <Button
        shape="circle"
        style={{ border: "none", marginLeft: 10 }}
        onClick={showModalPostDetail}
      >
        <img src="/comment.svg" width="24px" height="24px" alt=""></img>
      </Button>
      <Button shape="circle" style={{ border: "none", marginLeft: 10 }}>
        <img src="/share.svg" width="24px" height="24px" alt=""></img>
      </Button>
    </div>
  );
}

export default Action;
