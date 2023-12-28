import { AiFillHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PostProps } from "../../pages/Home/homePage";

interface PostBoxProps {
  post: PostProps;
}
// export const text = ({ post }: { post: PostProps }) => {};
// 위에 프롭스 타입선언과 아래는 같다. 아래는 단지 컴포넌트에서 인터페이스를 한번 더 선언해준 것.
const PostBox = ({ post }: PostBoxProps) => {
  const handleDelete = () => {};
  return (
    <div className="post_box" key={post.id}>
      <Link to={`/posts/${post?.id}`}>
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
            <div className="post_email">{post?.email}</div>
            <div className="post_createdAt">{post?.createdAt}</div>
          </div>
          <div className="post_box-content">{post?.content}</div>
        </div>
      </Link>
      <div className="post_box-footer">
        {/* post.uid === user.uid 일때 */}
        <>
          <button type="button" className="post_delete" onClick={handleDelete}>
            Delete
          </button>
        </>
        <>
          <button type="button" className="post_edit">
            <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
          </button>
        </>
        <button type="button" className="post_likes">
          <AiFillHeart></AiFillHeart>
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