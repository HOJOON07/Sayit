import PostForm from "../../components/posts/PostForm";
import PostBox from "../../components/posts/PostBox";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebaseApp";

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

// const posts: PostProps[] = [
//   {
//     id: "1",
//     email: "ghwns107@naver.com",
//     content: "내용입니다.",
//     createdAt: "2023-12-23",
//     uid: "testuid",
//   },
//   {
//     id: "2",
//     email: "ghwns107@naver.com",
//     content: "내용입니다.",
//     createdAt: "2023-12-23",
//     uid: "testuid",
//   },
//   {
//     id: "3",
//     email: "ghwns107@naver.com",
//     content: "내용입니다.",
//     createdAt: "2023-12-23",
//     uid: "testuid",
//   },
//   {
//     id: "4",
//     email: "ghwns107@naver.com",
//     content: "내용입니다.",
//     createdAt: "2023-12-23",
//     uid: "testuid",
//   },
//   {
//     id: "5",
//     email: "ghwns107@naver.com",
//     content: "내용입니다.",
//     createdAt: "2023-12-23",
//     uid: "testuid",
//   },
//   {
//     id: "6",
//     email: "ghwns107@naver.com",
//     content: "내용입니다.",
//     createdAt: "2023-12-23",
//     uid: "testuid",
//   },
// ];

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postRef = collection(db, "posts");
      let postsQuery = query(postRef, orderBy("createdAt", "desc"));

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((docs) => ({
          ...docs.data(),
          id: docs?.id,
        }));
        setPosts(dataObj as PostProps[]);
        console.log(dataObj);
      });
    }
    console.log(user);
  }, []);

  const handleDelete = () => {};
  return (
    <div className="home">
      <div className="home _top">
        <div className="home_title"></div>
        <div className="home_tabs">
          <div className="home_tab home_tab-active">For You</div>
          <div className="home_tab">Following</div>
        </div>
      </div>

      <PostForm />
      <div className="post">
        {posts.length > 0 ? (
          posts?.map((post) => <PostBox key={post.id} post={post} />)
        ) : (
          <div className="post_no-posts">
            <div className="post_text">게시글이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}
