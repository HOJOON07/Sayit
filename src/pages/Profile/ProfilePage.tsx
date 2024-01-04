import React, { useContext, useEffect, useState } from "react";
import { PostProps } from "../Home/homePage";
import PostBox from "../../components/posts/PostBox";
import AuthContext from "../../context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseApp";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { languageState } from "../../atom";

const PROFILE_DEFAULT_URL = "/logo512.png";

type TabType = "my" | "like";

const ProfilePage = () => {
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useRecoilState(languageState);

  const navigate = useNavigate();

  const onClickLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
    localStorage.setItem("language", language === "ko" ? "en" : "ko");
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      const myPostQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const likePostQuery = query(
        postsRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(myPostQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyPosts(dataObj as PostProps[]);
      });

      onSnapshot(likePostQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikePosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home _top">
        <div className="home_title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile_image"
            className="profile_image"
            width={100}
            height={100}
          />
          <div className="profile_flex">
            <button
              type="button"
              className="profile_btn"
              onClick={() => navigate("/profile/edit")}
            >
              프로필 수정
            </button>
            <button
              type="button"
              className="profile_btn-language"
              onClick={onClickLanguage}
            >
              {language === "ko" ? "한국어" : "English"}
            </button>
          </div>
        </div>
        <div className="profile_text">
          <div className="profile_name">{user?.displayName || "사용자님"}</div>
          <div className="profile_email">{user?.email}</div>
        </div>
        <div className="home_tabs">
          <div
            className={`home_tab ${activeTab === "my" && "home_tab-active"}`}
            onClick={() => {
              setActiveTab("my");
            }}
          >
            For You
          </div>
          <div
            className={`home_tab ${activeTab === "like" && "home_tab-active"}`}
            onClick={() => {
              setActiveTab("like");
            }}
          >
            Likes
          </div>
        </div>
      </div>

      {activeTab === "my" && (
        <div className="post">
          {myPosts?.length > 0 ? (
            myPosts?.map((post) => (
              <PostBox post={post} key={post.id}></PostBox>
            ))
          ) : (
            <div className="post_no-posts">
              <div className="post_text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}
      {activeTab === "like" && (
        <div className="post">
          {likePosts?.length > 0 ? (
            likePosts?.map((post) => (
              <PostBox post={post} key={post.id}></PostBox>
            ))
          ) : (
            <div className="post_no-posts">
              <div className="post_text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
