import { useCallback, useEffect, useState } from "react";
import { PostProps } from "../Home/homePage";
import PostBox from "../../components/posts/PostBox";
import Loader from "../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseApp";
import { IoIosArrowBack } from "react-icons/io";
import PostHeader from "./PostHeader";
import CommentForm from "../../components/comments/CommentForm";
import CommentBox, { CommentProps } from "../../components/comments/CommentBox";

const PostDetail = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostProps | null>(null);
  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });

      setPost({ ...(docSnap.data() as PostProps), id: docSnap?.id });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PostHeader />
      {post ? (
        <>
          <PostBox post={post}></PostBox>
          <CommentForm post={post}></CommentForm>
          {post?.comments
            ?.slice(0)
            ?.reverse()
            ?.map((data: CommentProps, index: number) => (
              <CommentBox data={data} key={index} post={post}></CommentBox>
            ))}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PostDetail;
