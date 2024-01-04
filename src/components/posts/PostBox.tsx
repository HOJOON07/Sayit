import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { PostProps } from "../../pages/Home/homePage";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebaseApp";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";
import FollowingBox from "../following/FollowingBox";
import useTranslation from "../../hooks/useTranslation";

interface PostBoxProps {
  post: PostProps;
}
// export const text = ({ post }: { post: PostProps }) => {};
// 위에 프롭스 타입선언과 아래는 같다. 아래는 단지 컴포넌트에서 인터페이스를 한번 더 선언해준 것.
const PostBox = ({ post }: PostBoxProps) => {
  const { user } = useContext(AuthContext);
  const imageRef = ref(storage, post?.imageUrl);
  const t = useTranslation();

  const navigate = useNavigate();
  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니가?");
    if (confirm) {
      // 스토리지에서 이미지도 같이 삭제해줘야 실제로 삭제가 된다.

      if (post?.imageUrl) {
        deleteObject(imageRef).catch((err) => console.log(err));
      }

      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };
  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      // 사용자가 좋아요를 미리 한 경우 -> 좋아요를 취소한다.
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      // 사용자가 좋아요를 하지 않은 경우 -> 좋아요를 추가한다.
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
    }
  };

  return (
    <div className="post_box" key={post.id}>
      <div className="post_box-profile">
        <div className="post_flex">
          {post?.profileUrl ? (
            <img
              src={post?.profileUrl}
              alt="profile"
              className="post_box-profile-img"
            />
          ) : (
            <FaUserCircle className="post_box-profile-icon" />
          )}
          <div className="post_flex-between">
            <div className="post_flex">
              <div className="post_email">{post?.email}</div>
              <div className="post_createdAt">{post?.createdAt}</div>
            </div>
            <FollowingBox post={post} />
          </div>
        </div>
        <Link to={`/posts/${post?.id}`}>
          <div className="post_box-content">{post?.content}</div>
          {post?.imageUrl && (
            <div className="post_image-div">
              <img
                src={post?.imageUrl}
                alt="게시글 이미지"
                className="post_image"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className="post-form_hastags-outputs">
            {post?.hashTags?.map((tag, index) => (
              <span className="post-form_hashtags-tag" key={index}>
                #{tag}
              </span>
            ))}
          </div>
        </Link>
      </div>
      <div className="post_box-footer">
        {/* post.uid === user.uid 일때 */}
        {user?.uid === post.uid && (
          <>
            <button
              type="button"
              className="post_delete"
              onClick={handleDelete}
            >
              {t("BUTTON_DELETE")}
            </button>
            <button type="button" className="post_edit">
              <Link to={`/posts/edit/${post?.id}`}>{t("BUTTON_EDIT")}</Link>
            </button>
          </>
        )}
        <button type="button" className="post_likes" onClick={toggleLike}>
          {user && post?.likes?.includes(user.uid) ? (
            <AiFillHeart />
          ) : (
            <AiOutlineHeart />
          )}
          {post?.likeCount || 0}
        </button>
        <button type="button" className="post_comments">
          <FaRegComment></FaRegComment>
          {post?.comments?.length || 0}
        </button>
      </div>
    </div>
  );
};

export default PostBox;
