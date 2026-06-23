import { useEffect, useState } from "react";
import Navbar from "./navbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/notifications`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    setNotifications(data.notifications);
  };

  return (
    <>
      <Navbar />

      <span style={{fontWeight:"600", fontSize:"21px" , margin:"24px"}} >Notifications</span>

      {notifications.length === 0 && (
        <p>No notifications</p>
      )}

      {notifications.map((n) => (
        <div className="div"
          key={n._id}
        >
          <p>{n.message}</p>


          <small>
            {new Date(n.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </>
  );
}

export default Notifications;