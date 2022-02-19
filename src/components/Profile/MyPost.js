import "./Profile.css";
import "./MyPost.css";
import "antd/dist/antd.css";

import React, { useContext } from "react";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";

import { AppContext } from "../../context/AppProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MyPost({ post }) {
  const { setPost, setIsModalDetailPostVisible } = useContext(AppContext);

  const showModalPostDetail = () => {
    setPost(post);
    setIsModalDetailPostVisible(true);
  };

  return (
    <div
      className="my_post_container"
      style={{ marginBottom: 25, marginLeft: 10, marginRight: 10 }}
      onClick={showModalPostDetail}
    >
      {post.images.slice(0, 1).map((image) => (
        <div className="my_post_image" style={{ width: 250, height: 250 }}>
          <img
            key={image.url}
            style={{ objectFit: "cover" }}
            src={image.url}
            alt=""
            width="100%"
            height="100%"
          />
        </div>
      ))}
      <div className="middle">
        <div>
          <FontAwesomeIcon
            icon={faHeart}
            style={{ color: "#fff", fontSize: 20 }}
          />
          <span className="countLike">{post.likes.length}</span>
        </div>
        <div>
          <FontAwesomeIcon
            icon={faComment}
            style={{ color: "#fff", fontSize: 20 }}
          />
          <span className="countComment">{post.comments.length}</span>
        </div>
      </div>
    </div>
  );
}
