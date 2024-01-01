import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { db } from "../../firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";

const PostForm = () => {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);
  const handleFileUpload = () => {};

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
      });
      setContent("");
      toast.success("게시글을 생성했습니다.");
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
        <input type="submit" value="Tweet" className="post-form_submit-btn" />
      </div>
    </form>
  );
};

export default PostForm;
