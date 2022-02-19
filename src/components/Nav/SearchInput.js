import React, { useEffect, useState } from "react";
import {
  List,
  Input,
  Popover,
  Avatar,
  Typography,
  Divider,
  Skeleton,
} from "antd";
import { db } from "../../Firebase/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

export default function SearchInput() {
  const { Search } = Input;
  const [textInput, setTextInput] = useState("");
  const [resultSearch, setResultSearch] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMoreData = async () => {
    // if (loading) {
    //   return;
    // }
    // setLoading(true);
    // const q = query(
    //   collection(db, "users"),
    //   where("displayName", ">=", textInput),
    //   where("displayName", "<=", textInput + "\uf8ff")
    // );
    // const querySnapshot = await getDocs(q);
    // setResultSearch(
    //   querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    // );
  };

  const handleInputText = (e) => {
    setTextInput(e.target.value);
  };

  useEffect(() => {
    const getData = async () => {
      const q = query(
        collection(db, "users"),
        where("displayName", ">=", textInput),
        where("displayName", "<=", textInput + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      setResultSearch(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    textInput === "" ? setResultSearch([]) : getData();
  }, [textInput]);

  const content = (
    <div
      id="scrollableDiv"
      style={{
        height: 300,
        overflow: "auto",
        // padding: "0 16px",
        width: 300,
      }}
    >
      <InfiniteScroll
        dataLength={resultSearch.length}
        // next={loadMoreData}
        // hasMore={resultSearch.length < 5}
        // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={resultSearch}
          split={false}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar size="large" src={item.photoURL} />}
                title={
                  <Link to={`/profile/${item.displayName}/${item.uid}`}>
                    {item.displayName}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );

  return (
    <div className="header_search">
      <Popover
        placement="bottom"
        // title={"Tìm kiếm"}
        content={content}
        style={{ width: 100 }}
        trigger="click"
      >
        <Search
          placeholder="search..."
          // onSearch={handleInputText}
          onChange={handleInputText}
          style={{ width: 200 }}
        />
      </Popover>
    </div>
  );
}
