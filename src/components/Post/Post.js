import "./Post.css";

import { List, Skeleton, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import Action from "./Action";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import PostComment from "./PostComment";
import Slider from "react-slick";
import { db } from "../../Firebase/firebase-config";
import { formatDistance } from "date-fns";

export default function Post({ post }) {
  const { setPost, setIsModalDetailPostVisible } = useContext(AppContext);
  const [userPost, setUserPost] = useState({});
  const { user } = useContext(AuthContext);

  var settingSlider = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const showModalPostDetail = () => {
    setPost(post);
    setIsModalDetailPostVisible(true);
  };

  useEffect(() => {
    const getUser = async () => {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", post.username)
      );
      const querySnapshot = await getDocs(q);
      setUserPost(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getUser();
  }, [post.username]);

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt={post.username}
          src={userPost.length > 0 ? userPost[0].photoURL : post.username}
        />
        <div>
          <Link
            to={`/profile/${post.username}/${post.userId}`}
            style={{ fontWeight: 600, marginTop: 5, color: "black" }}
          >
            {post.username}
          </Link>
        </div>
      </div>

      <Slider {...settingSlider}>
        {post.images.map((image) => (
          <img className="post_image" src={image.url} key={image.url} alt="" />
        ))}
      </Slider>

      <Action user={user} post={post} />

      <div className="post_countLike">
        <p>{post.likes === undefined ? 0 : post.likes.length} lượt thích</p>
      </div>

      <div className="post_text">
        <span style={{ fontWeight: 600 }}>{post.username}</span> {post.caption}
      </div>

      <div className="post_showComments">
        <a onClick={showModalPostDetail}>
          Xem tất cả {post.comments.length} bình luận
        </a>
      </div>
      <div>
        {post.comments.length > 0 && (
          <List
            style={{ padding: 0 }}
            split={false}
            size="small"
            dataSource={post.comments
              .sort((firstEl, secondEl) => {
                return secondEl.createdAt - firstEl.createdAt;
              })
              .slice(0, 2)}
            renderItem={(comment) => (
              <List.Item style={{ padding: 0 }}>
                <div
                  className="post_text"
                  style={{ paddingTop: 4, paddingBottom: 6 }}
                >
                  <span style={{ fontWeight: 600 }}>{comment.username}</span>{" "}
                  {comment.content}
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
      <div className="post_timeCreated">
        <p style={{ textTransform: "uppercase" }}>
          {post.createdAt &&
            formatDistance(
              new Date(post.createdAt.seconds * 1000),
              new Date()
            )}{" "}
          ago
        </p>
      </div>
      <PostComment post={post} user={user} />
    </div>
  );
}
