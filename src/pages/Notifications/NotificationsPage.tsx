import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseApp";
import NotificationsBox from "../../components/notifications/NotificationsBox";

export interface NotificationProps {
  id: string;
  uid: string;
  url: string;
  isRead: boolean;
  content: string;
  createdAt: string;
}

const NotificationsPage = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    if (user) {
      let ref = collection(db, "notifications");
      let notificationQuery = query(
        ref,
        where("uid", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      onSnapshot(notificationQuery, (snapshot) => {
        let dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotifications(dataObj as NotificationProps[]);
      });
    }
  }, [user]);
  console.log(notifications);

  return (
    <div className="home">
      <div className="home_top">
        <div className="home_title">
          <div className="home_title-text">Notifications</div>
        </div>
      </div>
      <div className="post">
        {notifications?.length > 0 ? (
          notifications?.map((notice) => (
            <NotificationsBox key={notice.id} notifications={notice} />
          ))
        ) : (
          <div className="post_no-posts">
            <div className="post_text">알림이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
