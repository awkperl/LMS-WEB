import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Notifications({ token }) {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api("/notifications", "GET", null, token)
      .then(setNotifications)
      .catch(console.error);

  }, [token]);

  return (
    <div>

      <h2>Notifications</h2>

      {notifications.length === 0 && (
        <p>No notifications</p>
      )}

      {notifications.map(n => (

        <div
          key={n.id}
          style={{
            background: "white",
            padding: 15,
            marginTop: 10,
            borderRadius: 8
          }}
        >
          {n.message}
        </div>

      ))}

    </div>
  );
}