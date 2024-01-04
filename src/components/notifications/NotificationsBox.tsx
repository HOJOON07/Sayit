import { useNavigate } from "react-router-dom";
import { NotificationProps } from "../../pages/Notifications/NotificationsPage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseApp";
import styles from "./Notification.module.scss";

interface NotificationsBoxProps {
  notifications: NotificationProps;
}

const NotificationsBox = ({ notifications }: NotificationsBoxProps) => {
  const navigate = useNavigate();
  const onClickNotifications = async (url: string) => {
    // 알림 속성중 읽었는지 여부를 체크하는 isread업데이트
    const ref = doc(db, "notifications", notifications.id);
    await updateDoc(ref, {
      isRead: true,
    });
    navigate(url);
  };

  return (
    <div key={notifications.id} className={styles.notification}>
      <div onClick={() => onClickNotifications(notifications?.url)}>
        <div className={styles.notification_flex}>
          <div className={styles.notification_createdAt}>
            {notifications?.createdAt}
          </div>
          {notifications?.isRead === false && (
            <div className={styles.notification_unread} />
          )}
        </div>
        <div className="notification_content">{notifications.content}</div>
      </div>
    </div>
  );
};

export default NotificationsBox;
