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

const SearchPage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>("");
  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setTagQuery(value.trim());
  };

  useEffect(() => {
    if (user) {
      let postRef = collection(db, "posts");
      let postQuery = query(
        postRef,
        where("hashTags", "array-contains-any", [tagQuery]),
        orderBy("createdAt", "desc")
      );
      onSnapshot(postQuery, (snapshot) => {
        let dataObj = snapshot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);

  return (
    <div className="home">
      <div className="home_top">
        <div className="home_title">
          <div className="home_title-text">Search</div>
        </div>
        <div className="home_search-div">
          <input
            placeholder="해시태그 검색"
            className="home_search"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="post">
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
    </div>
  );
};

export default SearchPage;
