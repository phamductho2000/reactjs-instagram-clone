import React, { useContext, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Modal, Upload, Spin, Image } from "antd";
import ImgCrop from "antd-img-crop";
import { AppContext } from "../../context/AppProvider";
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../Firebase/firebase-config";
import { async } from "@firebase/util";

function UploadImageModal() {
  const {
    isModalUploadImageVisible,
    setIsModalUploadImageVisible,
    setIsModalWriteCaptionVisible,
    listImageUpload,
    setListImageUpload,
  } = useContext(AppContext);

  const listFileType = ["jpeg", "png", "jpg"];

  const [fileList, setFileList] = useState([]);

  const [visiblePreview, setVisiblePreview] = useState(false);

  const [fileState, setFileState] = useState(true);

  const handleCancel = () => {
    fileList.length > 0 ? showConfirm() : setIsModalUploadImageVisible(false);
  };

  const nextToCaptionModal = () => {
    fileList.length === 0
      ? alert("Bạn chưa thêm ảnh nào")
      : setIsModalWriteCaptionVisible(true);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setVisiblePreview(true);
  };

  const onRemove = (file) => {
    const desertRef = ref(storage, `images/${file.originFileObj.name}`);
    deleteObject(desertRef)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const customRequest = ({ onError, onSuccess, onProgress, file }) => {
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          onProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error.message);
        },
        async () => {
          await getDownloadURL(storageRef)
            .then(async (url) => {
              setListImageUpload((prev) => [...prev, { name: file.name, url }]);
              onSuccess(null, file);
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      );
    } catch (e) {
      onError(e);
    }
  };

  const beforeUpload = (file) => {
    // if (listFileType.includes(file.type.substr(6, file.type.length))) {
    //   setFileState(true);
    //   return true;
    // }
    // alert("Vui lòng chỉ tải lên hình ảnh");
    // setFileState(false);
    if (file) {
      setFileState(true);
      return true;
    }
    setFileState(false);
    return false;
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
              setFileList([]);
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

  const beforeCrop = () => {
    return fileState;
  };

  return (
    <div>
      <Modal
        title="Tạo bài viết mới"
        visible={isModalUploadImageVisible}
        onCancel={handleCancel}
        width={400}
        bodyStyle={{ height: "auto", padding: 10, overflow: "hidden" }}
        footer={[
          <Button key="link" type="primary" onClick={nextToCaptionModal}>
            Tiếp tục
          </Button>,
        ]}
      >
        <ImgCrop beforeCrop={beforeCrop} rotate>
          <Upload
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            onRemove={onRemove}
            beforeUpload={beforeUpload}
            progress={{
              strokeWidth: 5,
              strokeColor: { "0%": "#108ee9", "100%": "#87d068" },
            }}
            iconRender={() => {
              return (
                <Spin
                  tip={<p style={{ marginBottom: 10 }}>Đang tải...</p>}
                  size="small"
                ></Spin>
              );
            }}
          >
            {fileList.length < 5 && "+ Thêm ảnh"}
          </Upload>
        </ImgCrop>
      </Modal>
      <Image
        style={{ display: "none" }}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
      />
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{
            visible: visiblePreview,
            onVisibleChange: (value) => {
              setVisiblePreview(value);
            },
          }}
        >
          {listImageUpload.length > 0 &&
            listImageUpload.map((image) => <Image src={image.url} />)}
        </Image.PreviewGroup>
      </div>
    </div>
  );
}

export default UploadImageModal;
