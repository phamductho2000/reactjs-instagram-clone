import { Avatar, Col, List, Modal, Row, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import Action from "../Post/Action";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import PostComment from "../Post/PostComment";
import Slider from "react-slick";
import { db } from "../../Firebase/firebase-config";
import { formatDistance } from "date-fns";

export default function DetailPostModal() {
  const { user } = useContext(AuthContext);
  const { isModalDetailPostVisible, setIsModalDetailPostVisible, post } =
    useContext(AppContext);
  const [userPost, setUserPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  var settingSlider = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (post) {
      const getUser = async () => {
        const q = query(
          collection(db, "users"),
          where("displayName", "==", post.username)
        );
        const querySnapshot = await getDocs(q);
        setUserPost(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        setIsLoading(false);
      };
      getUser();
    } else {
      setIsLoading(true);
    }
  }, [post, post.username]);

  return (
    <Modal
      centered
      visible={isModalDetailPostVisible}
      onCancel={() => setIsModalDetailPostVisible(false)}
      width={1000}
      bodyStyle={{ padding: 0, height: 500 }}
      footer={null}
      closable={false}
    >
      {!isLoading ? (
        <Row>
          <Col span={12} className="post_detailLeft">
            <Slider {...settingSlider}>
              {post.images.map((image) => (
                <img
                  src={image.url}
                  key={image.id}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{ objectFit: "contain" }}
                />
              ))}
            </Slider>
          </Col>
          <Col span={12} className="post_detailRight">
            <div className="post_detailUser">
              <Avatar
                className="post_avatar"
                alt={post.username}
                src={userPost.length > 0 ? userPost[0].photoURL : post.username}
              />
              <a
                href={`/profile/${post.username}/${post.userId}`}
                style={{ fontWeight: 600, color: "black" }}
              >
                {post.username}
              </a>
            </div>

            <div className="post_detailComments">
              <div className="post_comment">
                <Avatar
                  className="post_avatar"
                  alt={post.username}
                  src={
                    userPost.length > 0 ? userPost[0].photoURL : post.username
                  }
                />
                <div style={{ marginLeft: 5 }}>
                  <a
                    href={`/profile/${post.username}/${post.userId}`}
                    style={{ fontWeight: 600, marginTop: 5, color: "black" }}
                  >
                    {post.username}
                  </a>{" "}
                  {post.caption}
                  <p
                    style={{
                      fontSize: "x-small",
                      color: "#8e8e8e",
                      marginTop: 10,
                      textTransform: "uppercase",
                    }}
                  >
                    {formatDistance(
                      new Date(post.createdAt.seconds * 1000),
                      new Date()
                    )}{" "}
                    ago
                  </p>
                </div>
              </div>
              {post.comments.length > 0 && (
                <List
                  itemLayout="horizontal"
                  split={false}
                  dataSource={post.comments.sort((firstEl, secondEl) => {
                    return secondEl.createdAt - firstEl.createdAt;
                  })}
                  renderItem={(comment) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={comment.photoURL} />}
                        title={
                          <>
                            <a
                              href={`/profile/${comment.username}/${comment.userId}`}
                            >
                              {comment.username}
                            </a>
                            <span style={{ fontWeight: 400 }}>
                              {" "}
                              {comment.content}
                            </span>
                          </>
                        }
                        description={
                          <p
                            style={{
                              fontSize: "x-small",
                              color: "#8e8e8e",
                              textTransform: "uppercase",
                            }}
                          >
                            {formatDistance(
                              new Date(comment.createdAt),
                              new Date()
                            )}{" "}
                            ago
                          </p>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </div>

            <div>
              <Action user={user} post={post} />
              <div className="post_countLike">
                <p>{post.likes.length} lượt thích</p>
              </div>
              <div className="post_timeCreated">
                <p style={{ textTransform: "uppercase" }}>
                  {formatDistance(
                    new Date(post.createdAt.seconds * 1000),
                    new Date()
                  )}{" "}
                  ago
                </p>
              </div>
              <PostComment post={post} user={user} />
            </div>
          </Col>
        </Row>
      ) : (
        <Spin style={{ position: "absolute", top: "50%", inset: 0 }}></Spin>
      )}
    </Modal>
  );
}
