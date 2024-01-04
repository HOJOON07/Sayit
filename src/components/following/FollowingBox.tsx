import React, { useCallback, useContext, useEffect, useState } from "react";
import { PostProps } from "../../pages/Home/homePage";
import AuthContext from "../../context/AuthContext";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseApp";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps;
}

interface UserProps {
  id: string;
}
const FollowingBox = ({ post }: FollowingProps) => {
  const { user } = useContext(AuthContext);

  const [postFollowers, setPostFollowers] = useState<any>([]);

  const onClickFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        // 내가 -> 타인을 팔로우 해서 팔로잉 collection 생성, 업데이트
        const followingRef = doc(db, "following", user?.uid);

        await setDoc(
          followingRef,
          {
            users: arrayUnion({ id: post?.uid }),
          },
          { merge: true }
        );

        // 팔로우를 당하면 당하는 사람이 주체가 되어 follower collection 생성, 업데이트

        const followerRef = doc(db, "follower", post?.uid);

        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true }
        );
      }

      //팔로잉 알림 생성 로직
      await addDoc(collection(db, "notifications"), {
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        content: `${user?.email || user?.displayName}가 팔로우를 했습니다.`,
        url: "#",
        isRead: false,
        uid: post?.uid,
      });
      toast.success("팔로우를 했습니다.");
    } catch (error) {
      console.log(error);
    }
  };
  const onClickDeleteFollow = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid }),
        });

        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user.uid }),
        });
      }
      toast.success("팔로우를 취소했습니다.");
    } catch (err) {
      console.log(err);
    }
  };

  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "follower", post.uid);
      onSnapshot(ref, (doc) => {
        setPostFollowers([]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setPostFollowers((prev: UserProps[]) =>
              prev ? [...prev, user?.id] : []
            )
          );
      });
    }
  }, [post.uid]);

  useEffect(() => {
    if (post?.uid) getFollowers();
  }, [post.uid, getFollowers]);
  return (
    <>
      {user?.uid !== post?.uid &&
        (postFollowers?.includes(user?.uid) ? (
          <button
            type="button"
            className="post_following-btn"
            onClick={onClickDeleteFollow}
          >
            Following
          </button>
        ) : (
          <button
            type="button"
            className="post_follow-btn"
            onClick={onClickFollow}
          >
            Follower
          </button>
        ))}
    </>
  );
};

export default FollowingBox;
