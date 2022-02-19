import { Avatar, Button, Col, Input, Modal, Row, Typography } from "antd";
import React, { useContext, useState } from "react";
import { db, storage } from "../../Firebase/firebase-config";
import { deleteObject, ref } from "firebase/storage";

import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import Picker from "emoji-picker-react";
import Slider from "react-slick";
import { addDocument } from "../../Firebase/service";
import { doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const { TextArea } = Input;

export default function WriteCaptionModal() {
  const navigate = useNavigate();
  const {
    user: { displayName, photoURL, uid },
  } = useContext(AuthContext);
  const {
    isModalWriteCaptionVisible,
    setIsModalWriteCaptionVisible,
    setIsModalUploadImageVisible,
    listImageUpload,
    setListImageUpload,
  } = useContext(AppContext);
  const [caption, setCaption] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  var settingSlider = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const showEmoji = () => {
    setShowPicker(true);
  };
  const onEmojiClick = (event, emojiObject) => {
    setCaption((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };
  const createPost = async () => {
    let postId = uuidv4();
    addDocument(doc(db, "posts", postId), {
      username: displayName,
      userId: uid,
      caption: caption,
      comments: [],
      images: listImageUpload,
      likes: [],
    });
    setListImageUpload([]);
    setCaption("");
    setShowPicker(false);
    setIsModalWriteCaptionVisible(false);
    setIsModalUploadImageVisible(false);
    navigate("/");
  };

  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Bỏ bài viết?",
      content: "Nếu rời đi bạn sẽ mất những gì vừa chỉnh sửa",
      onOk() {
        listImageUpload.forEach(({ name }) => {
          const desertRef = ref(storage, `images/${name}`);
          deleteObject(desertRef)
            .then(() => {
              setIsModalUploadImageVisible(false);
              setIsModalWriteCaptionVisible(false);
              setListImageUpload([]);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      },
      onCancel() {
        console.log("Cancel confirm");
      },
    });
  };

  return (
    <div>
      <Modal
        title="Tạo bài viết mới"
        visible={isModalWriteCaptionVisible}
        onCancel={showConfirm}
        width={700}
        bodyStyle={{ padding: 0, height: "auto", overflow: "hidden" }}
        footer={[
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button key="link" type="primary" onClick={createPost}>
              Quay lại
            </Button>
            <Button key="link" type="primary" onClick={createPost}>
              Đăng bài
            </Button>
          </div>,
        ]}
      >
        <Row>
          <Col span={12} className="modal-caption-left">
            <Slider {...settingSlider}>
              {listImageUpload.map(({ url }) => (
                <div>
                  <img
                    key={url}
                    src={url}
                    alt=""
                    width="100%"
                    style={{ objectFit: "contain" }}
                  ></img>
                </div>
              ))}
            </Slider>
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ marginBottom: 10, marginTop: 10, padding: 10 }}>
                <Avatar src={photoURL} />
                <Typography.Text strong style={{ marginLeft: 10 }}>
                  {displayName}
                </Typography.Text>
              </div>
              <TextArea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Viết chú thích..."
                autoSize={{ minRows: 8, maxRows: 20 }}
                bordered={false}
              />
            </div>
            <div style={{ position: "relative", padding: 10 }}>
              <Button
                shape="circle"
                style={{ border: "none" }}
                onClick={showEmoji}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/637/637651.png"
                  width="24px"
                  height="24px"
                  alt=""
                ></img>
              </Button>
              {showPicker && (
                <Picker
                  onEmojiClick={onEmojiClick}
                  disableSkinTonePicker={true}
                  disableSearchBar={true}
                  pickerStyle={{
                    position: "absolute",
                    zIndex: 5,
                    bottom: "125%",
                  }}
                />
              )}
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
