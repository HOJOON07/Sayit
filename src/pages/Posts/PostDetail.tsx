import { useCallback, useEffect, useState } from "react";
import { PostProps } from "../Home/homePage";
import PostBox from "../../components/posts/PostBox";
import Loader from "../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseApp";
import { IoIosArrowBack } from "react-icons/io";

const PostDetail = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostProps | null>(null);
  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);

      setPost({ ...(docSnap.data() as PostProps), id: docSnap?.id });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <div className="post_header">
        <button type="button" onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </button>
      </div>
      {post ? <PostBox post={post}></PostBox> : <Loader />}
    </div>
  );
};

export default PostDetail;
