import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { createPushTarget } from "@/lib/appwrite.ts";

const firebaseConfig = {
  apiKey: "AIzaSyBb4D9QQpeHG2v_7Yxf4DR0rVvD24eMdi0",
  authDomain: "vtuberstamprally.firebaseapp.com",
  projectId: "vtuberstamprally",
  storageBucket: "vtuberstamprally.appspot.com",
  messagingSenderId: "689328750745",
  appId: "1:689328750745:web:636031de1e4b3c4d493808",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(
      import.meta.env.MODE === "production" ? "/sw.js" : "/dev-sw.js?dev-sw",
      { type: import.meta.env.MODE === "production" ? "classic" : "module" },
    )
    .then((registration) => {
      getToken(messaging, {
        vapidKey:
          "BOO7L8x8dcp5y1PV6paDeKa_dm_demqbeZPdIbkK-xNnT-M_VDzqceH7-AbYwp5fmHRNHbgkLGZK8LwKDeXi8L0",
        serviceWorkerRegistration: registration,
      }).then((currentToken) => {
        // do something
        localStorage.setItem("fcmToken", currentToken);
        createPushTarget(currentToken);
      });
    });
}

export { messaging };
