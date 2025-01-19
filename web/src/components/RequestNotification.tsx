import { useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

const RequestNotification = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BOO7L8x8dcp5y1PV6paDeKa_dm_demqbeZPdIbkK-xNnT-M_VDzqceH7-AbYwp5fmHRNHbgkLGZK8LwKDeXi8L0",
        });
        if (token) {
          console.log("Token generated:", token);
          // Send this token to your server to store it for later use
        } else {
          console.log("No registration token available.");
        }
      } catch (err) {
        console.error("Error getting token:", err);
      }
    };

    requestPermission();
  }, []);

  return <div>Notification Setup 🚀</div>;
};

export default RequestNotification;
