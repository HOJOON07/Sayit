import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { db, storage } from "../../firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "../../pages/Home/homePage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import PostHeader from "../../pages/Posts/PostHeader";

const PostEditForm = () => {
  const params = useParams();

  const { user } = useContext(AuthContext);

  const [content, setContent] = useState("");
  const [post, setPost] = useState<PostProps | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [hashTag, setHashTag] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>();

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
  };
  const navigate = useNavigate();

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashTags);
      setImageFile(docSnap?.data()?.imageUrl);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  const onSubmit = async (e: any) => {
    setIsSubmit(true);
    e.preventDefault();
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    try {
      if (post) {
        // 새로운 사진이 업로드 되었다면 기존에 있던 사진은 지우고 새로운 사진을 업로드 해야한다.

        if (post?.imageUrl) {
          let imageRef = ref(storage, post?.imageUrl);
          await deleteObject(imageRef).catch((err) => {
            console.log(err);
          });
        }
        //새로운 파일 있다면 업로드
        let imageUrl = "";
        if (imageFile) {
          const data = await uploadString(storageRef, imageFile, "data_url");
          imageUrl = await getDownloadURL(data?.ref);
        }
        // 만약 사진이 아예 없다면 삭제

        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          hashTags: tags,
          imageUrl: imageUrl,
        });
      }
      navigate(`/posts/${post?.id}`);
      toast.success("게시글을 수정했습니다.");
      setIsSubmit(false);
      setImageFile(null);
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

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === " " && value.trim() !== "") {
      // 태그 생성
      // 같은 태그가 있다면 에러 발생
      if (tags?.includes(value.trim())) {
        toast.error("같은 태그가 있습니다.");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  const onChangeHashTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashTag(e.target.value?.trim());
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((value) => value !== tag));
  };
  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <textarea
          className="post-form_textarea"
          id="content"
          name="content"
          required
          placeholder="What is happenig?"
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
            placeholder="해시태그 + 스페이스바 입력"
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
                <img
                  src={imageFile}
                  alt="attachment"
                  width={100}
                  height={100}
                />
                <button
                  className="post-form_clear-btn"
                  type="button"
                  onClick={handleDeleteImage}
                >
                  clear
                </button>
              </div>
            )}
          </div>
          <input
            type="submit"
            value="수정"
            className="post-form_submit-btn"
            disabled={isSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default PostEditForm;
