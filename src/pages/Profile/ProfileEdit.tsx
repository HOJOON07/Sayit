import React, { useContext, useEffect, useState } from "react";
import PostHeader from "../Posts/PostHeader";
import { FiImage } from "react-icons/fi";
import AuthContext from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../firebaseApp";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const STORAGE_DOWNLOAD_URL = "https://firebasestorage.googleapis.com";

const ProfileEdit = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setDisplayName(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target as HTMLInputElement;

    const file = files?.[0];
    const fileReader = new FileReader();

    if (file) fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const FileUrl = e.currentTarget;
      const result = FileUrl.result;
      setImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
  };

  const onSubmit = async (e: any) => {
    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageurl = null;
    e.preventDefault();
    try {
      // 기존 이미지 삭제 (기존 유저 이미지가 firebase storage 이미지일 경우에만 삭제)
      if (user?.photoURL && user?.photoURL?.includes(STORAGE_DOWNLOAD_URL)) {
        const imageRef = ref(storage, user?.photoURL);
        if (imageRef) {
          await deleteObject(imageRef).catch((err) => console.log(err));
        }
      }
      // 이미지 업로드
      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, "data_url");
        newImageurl = await getDownloadURL(data?.ref);
      }
      // 업데이트 프로필 호출
      if (user) {
        await updateProfile(user, {
          displayName: displayName || "",
          photoURL: newImageurl || "",
        })
          .then(() => {
            toast.success("프로필이 업데이트 되었습니다.");
            navigate("/profile");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user?.photoURL);
    }
    if (user?.displayName) setDisplayName(user?.displayName);
  }, [user?.photoURL]);
  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <div className="post-form_profile">
          <input
            type="text"
            name="displayName"
            className="post-form_input"
            placeholder="이름"
            onChange={onChange}
            value={displayName}
          />
          {imageUrl && (
            <div className="post-form_attachment">
              <img src={imageUrl} alt="attachment" width={100} height={100} />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="post-form_clear-btn"
              >
                삭제
              </button>
            </div>
          )}

          <div className="post-form_submit-area">
            <div className="post-form_image-area">
              <label className="post-from_file" htmlFor="file-input">
                <FiImage className="post-form_file_icon"></FiImage>
              </label>
            </div>
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              type="submit"
              value="프로필 수정"
              className="post-form_submit-btn"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
