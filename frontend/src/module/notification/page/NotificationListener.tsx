// NotificationListener.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { notificationSocket } from "../services/notification.socket";
import type { Notification } from "../types/notification.types";
import NotificationToast from "./NotificationToast";

export default function NotificationListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    const socket = notificationSocket.connect();

    const initialize = async () => {
      try {
        if (!socket.connected) {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Socket connection timeout"));
            }, 10000);

            socket.once("connect", () => {
              clearTimeout(timeout);
              resolve();
            });

            socket.once("connect_error", (err) => {
              clearTimeout(timeout);
              reject(err);
            });
          });
        }

        notificationSocket.join(userId);

        notificationSocket.onNotification((notification: Notification) => {
          toast.custom(
            (t) => (
              <NotificationToast
                id={t}
                notification={notification}
                onNavigate={(path) => navigate(path)}
              />
            ),
            {
              duration: 6000,
            },
          );
        });

        notificationSocket.onUnreadCount(() => {
          
        });
      } catch (error) {
        console.error("Failed to initialize notification socket.", error);
      }
    };

    initialize();

    return () => {
      notificationSocket.offNotification();
      notificationSocket.offUnreadCount();
   
    };
  }, [navigate]);

  return null;
}