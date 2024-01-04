import PostForm from "../../components/posts/PostForm";
import PostBox from "../../components/posts/PostBox";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
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
  hashTags?: string[];
  imageUrl?: string;
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

type tabType = "all" | "following";

interface UserProps {
  id: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [activeTab, setActiveTab] = useState<tabType>("all");
  const [followingPost, setFollowingPost] = useState<PostProps[]>([]);
  const [followingIdList, setFollowingIdList] = useState<string[]>([""]);

  const { user } = useContext(AuthContext);

  // 실시간으로 팔로잉하고 있는 유저의 아이디 가져오기

  console.log(followingIdList);

  const getFollowingUserList = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user?.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIdList([" "]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIdList((prev) => (prev ? [...prev, user?.id] : []))
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) getFollowingUserList();
  }, [getFollowingUserList, user?.uid]);

  useEffect(() => {
    if (user) {
      let postRef = collection(db, "posts");
      let postsQuery = query(postRef, orderBy("createdAt", "desc"));
      let followingQuery = query(
        postRef,
        where("uid", "in", followingIdList),
        orderBy("createdAt", "desc")
      );

      onSnapshot(followingQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((docs) => ({
          ...docs.data(),
          id: docs?.id,
        }));
        setFollowingPost(dataObj as PostProps[]);
      });

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((docs) => ({
          ...docs.data(),
          id: docs?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [followingIdList, user]);

  return (
    <div className="home">
      <div className="home _top">
        <div className="home_title"></div>
        <div className="home_tabs">
          <div
            className={`home_tab ${activeTab === "all" && "home_tab-active"}`}
            onClick={() => {
              setActiveTab("all");
            }}
          >
            All
          </div>
          <div
            className={`home_tab ${
              activeTab === "following" && "home_tab-active"
            }`}
            onClick={() => {
              setActiveTab("following");
            }}
          >
            Following
          </div>
        </div>
      </div>

      <PostForm />
      {activeTab === "all" && (
        <div className="post">
          {posts.length > 0 ? (
            posts?.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post_no-posts">
              <div className="post_text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}
      {activeTab === "following" && (
        <div className="post">
          {followingPost.length > 0 ? (
            followingPost?.map((post) => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post_no-posts">
              <div className="post_text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
