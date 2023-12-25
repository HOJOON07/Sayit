import { FiImage } from "react-icons/fi";
interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
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
        </div>
      </form>
    </div>
  );
}
