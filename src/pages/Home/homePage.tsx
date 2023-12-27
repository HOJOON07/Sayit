import { FiImage } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "ghwns107@naver.com",
    content: "내용입니다.",
    createdAt: "2023-12-23",
    uid: "testuid",
  },
  {
    id: "2",
    email: "ghwns107@naver.com",
    content: "내용입니다.",
    createdAt: "2023-12-23",
    uid: "testuid",
  },
  {
    id: "3",
    email: "ghwns107@naver.com",
    content: "내용입니다.",
    createdAt: "2023-12-23",
    uid: "testuid",
  },
  {
    id: "4",
    email: "ghwns107@naver.com",
    content: "내용입니다.",
    createdAt: "2023-12-23",
    uid: "testuid",
  },
  {
    id: "5",
    email: "ghwns107@naver.com",
    content: "내용입니다.",
    createdAt: "2023-12-23",
    uid: "testuid",
  },
  {
    id: "6",
    email: "ghwns107@naver.com",
    content: "내용입니다.",
    createdAt: "2023-12-23",
    uid: "testuid",
  },
];

export default function HomePage() {
  const handleFileUpload = () => {};

  const handleDelete = () => {};
  return (
    <div className="home">
      <div className="home_title"></div>
      <div className="home_tabs">
        <div className="home_tab home_tab-active">For You</div>
        <div className="home_tab">Following</div>
      </div>
      <form className="post-form">
        <textarea
          className="post-form_textarea"
          id="content"
          name="content"
          placeholder="what is happening?"
          required
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
      <div className="post">
        {posts?.map((post) => (
          <div className="post_box" key={post.id}>
            <Link to={`/posts/${post.id}`}>
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
                <button
                  type="button"
                  className="post_delete"
                  onClick={handleDelete}
                >
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
        ))}
      </div>
    </div>
  );
}
