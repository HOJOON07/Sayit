import PostForm from "../../conponents/posts/PostForm";
import PostBox from "../../conponents/posts/PostBox";

export interface PostProps {
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
  const handleDelete = () => {};
  return (
    <div className="home">
      <div className="home_title"></div>
      <div className="home_tabs">
        <div className="home_tab home_tab-active">For You</div>
        <div className="home_tab">Following</div>
      </div>
      <PostForm />
      <div className="post">
        {posts?.map((post) => (
          <PostBox key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
