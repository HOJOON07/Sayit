import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { db, storage } from "../../firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useTranslation from "../../hooks/useTranslation";

const PostForm = () => {
  const { user } = useContext(AuthContext);

  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [hashTag, setHashTag] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>();

  const t = useTranslation();

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === " " && value.trim() !== "") {
      console.log("!!", value);
      // 태그 생성
      // 같은 태그가 있다면 에러 발생
      if (tags?.includes(value.trim())) {
        toast.error("같은 태그가 있습니다.");
      } else {
        console.log("여기");
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  const onChangeHashTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setHashTag(e.target.value?.trim());
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((value) => value !== tag));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();

    if (file) fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const url = e.currentTarget;
      const result = url.result;
      setImageFile(result);
    };

    console.log(files);
  };

  const onSubmit = async (e: any) => {
    setIsSubmit(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    e.preventDefault();
    try {
      //이미지 업로드
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }
      //업로드된 이미지의 다운로드 url 업데이트

      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl: imageUrl,
      });
      setTags([]);
      setHashTag("");
      setContent("");
      toast.success("게시글을 생성했습니다.");
      setImageFile(null);
      setIsSubmit(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form_textarea"
        id="content"
        name="content"
        required
        placeholder={t("POST_PLACEHOLDER")}
        value={content}
        onChange={onChange}
      ></textarea>
      <div className="post-form_hashtags">
        <span className="post-form_hashtags-outputs">
          {tags?.map((tag, index) => (
            <span
              className="post-form_hashtags-tag"
              key={index}
              onClick={() => {
                removeTag(tag);
              }}
            >
              #{tag}
            </span>
          ))}
        </span>
        <input
          className="post-form_input"
          name="hashtag"
          id="hashtag"
          placeholder={t("POST_HASHTAG")}
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className="post-form_submit-area">
        <div className="post-form_image-area">
          <label htmlFor="file-input" className="post-form_file">
            <FiImage className="post-form_file-icon"></FiImage>
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {imageFile && (
            <div className="post-form_attachment">
              <img src={imageFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form_clear-btn"
                type="button"
                onClick={handleDeleteImage}
              >
                {t("BUTTON_DELETE")}
              </button>
            </div>
          )}
        </div>
        <input
          type="submit"
          value="Tweet"
          className="post-form_submit-btn"
          disabled={isSubmit}
        />
      </div>
    </form>
  );
};

export default PostForm;
