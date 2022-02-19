import React, { useState } from "react";
import { Button, Input } from "antd";
import "antd/dist/antd.css";
import { db } from "../../Firebase/firebase-config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import Picker from "emoji-picker-react";

function PostComment({ post, user }) {
  const [textInput, setTextInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setTextInput((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  const postComment = async () => {
    await updateDoc(doc(db, "posts", post.id), {
      comments: arrayUnion({
        content: textInput,
        username: user.displayName,
        userId: user.uid,
        photoURL: user.photoURL,
        createdAt: Date.now(),
      }),
    });
    setTextInput("");
  };

  const showEmoji = () => {
    setShowPicker(true);
  };

  return (
    <div className="post_sendComment">
      <div style={{ position: "relative" }}>
        <Button shape="circle" style={{ border: "none" }} onClick={showEmoji}>
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
            pickerStyle={{ position: "absolute", zIndex: 5, bottom: "125%" }}
          />
        )}
      </div>
      <Input
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        bordered={false}
        placeholder="Thêm bình luận..."
      />
      <Button
        onClick={postComment}
        style={{ border: "none" }}
        disabled={!textInput}
      >
        Đăng
      </Button>
    </div>
  );
}

export default PostComment;
