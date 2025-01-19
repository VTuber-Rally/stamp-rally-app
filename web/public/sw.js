/* eslint-disable */
// from https://stackoverflow.com/questions/41144151/firebaseerror-we-are-unable-to-register-the-default-service-worker

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist;
if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }),
);

const firebaseConfig = {
  apiKey: "AIzaSyBb4D9QQpeHG2v_7Yxf4DR0rVvD24eMdi0",
  authDomain: "vtuberstamprally.firebaseapp.com",
  projectId: "vtuberstamprally",
  storageBucket: "vtuberstamprally.appspot.com",
  messagingSenderId: "689328750745",
  appId: "1:689328750745:web:636031de1e4b3c4d493808",
};

const firebaseApp = initializeApp(firebaseConfig);

// const messaging = getMessaging(firebaseApp);

self.skipWaiting();
clientsClaim();
