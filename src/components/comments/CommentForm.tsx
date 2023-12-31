import React, { useContext, useState } from "react";
import { PostProps } from "../../pages/Home/homePage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseApp";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";

export interface CommentFormProps {
  post: PostProps | null;
}

const CommentForm = ({ post }: CommentFormProps) => {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);

  const truncate = (str: string) => {
    return str?.length > 10 ? str.substring(0, 10) + "..." : str;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (post) {
      const postRef = doc(db, "posts", post?.id);

      const commentObj = {
        comment,
        uid: user?.uid,
        email: user?.email,
        createdAt: new Date().toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      await updateDoc(postRef, {
        comments: arrayUnion(commentObj),
      });

      // 댓글 달았다는 알림을 만들기
      if (user?.uid !== post?.uid) {
        await addDoc(collection(db, "notifications"), {
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          uid: post?.uid,
          isRead: false,
          url: `/posts/${post?.id}`,
          content: `${post?.content} 글에 댓글이 작성되었습니다.`,
        });
      }

      toast.success("댓글을 작성했습니다.");
      setComment("");

      try {
      } catch (error) {}
    }
  };

  const onChagne = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLTextAreaElement;

    if (name === "comment") setComment(value);
  };
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form_textarea"
        name="comment"
        id="comment"
        required
        placeholder="댓글을 입력해주세요"
        onChange={onChagne}
        value={comment}
      ></textarea>
      <div className="post-form_submit-area">
        <div></div>
        <input
          className="post-form_submit-btn"
          type="submit"
          value="Comment"
          disabled={!comment}
        ></input>
      </div>
    </form>
  );
};

export default CommentForm;
