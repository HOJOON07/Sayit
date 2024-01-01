import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { db } from "../../firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "../../pages/Home/homePage";

const PostEditForm = () => {
  const params = useParams();

  const [content, setContent] = useState("");
  const [post, setPost] = useState<PostProps | null>(null);

  const handleFileUpload = () => {};
  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (post) {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
        });
      }
      navigate(`/posts/${post?.id}`);
      toast.success("게시글을 수정했습니다.");
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
  return (
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
      <div className="post-form_submit-area">
        <label htmlFor="file-input" className="post-form-file">
          <FiImage className="post-form_file-icon"></FiImage>
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="수정" className="post-form_submit-btn" />
      </div>
    </form>
  );
};

export default PostEditForm;
