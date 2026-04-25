"use node";

import { ConvexError, v } from "convex/values";
import { ServiceAccount, cert, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import { api } from "./_generated/api.js";
import { action, internalAction } from "./_generated/server.js";

function getMessagingApp() {
  const app = initializeApp({
    credential: cert(JSON.parse(process.env.GOOGLE_FCM_KEY!) as ServiceAccount),
  });
  return getMessaging(app);
}

const messaging = getMessagingApp();

export const addTokenToFCM = internalAction({
  args: { token: v.string(), topic: v.union(v.literal("en"), v.literal("fr")) },
  handler: async (_ctx, args) => {
    const response = await messaging.subscribeToTopic([args.token], args.topic);
    return !!response.successCount;
  },
});

export const removeTokenFromFCM = internalAction({
  args: { token: v.string() },
  handler: async (_ctx, args) => {
    const enResponse = await messaging.unsubscribeFromTopic([args.token], "en");
    const frResponse = await messaging.unsubscribeFromTopic([args.token], "fr");
    return !!enResponse.successCount || !!frResponse.successCount;
  },
});

const notification = v.object({
  title: v.string(),
  body: v.string(),
});

export const sendNotification = action({
  args: { enMessage: notification, frMessage: notification },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.loggedInUser);
    if (!user || user.role !== "staff") {
      throw new ConvexError("Unauthorized");
    }
    await Promise.all([
      messaging.send({
        topic: "en",
        notification: {
          title: args.enMessage.title,
          body: args.enMessage.body,
        },
        webpush: {
          fcmOptions: {
            link: new URL("/reward", process.env.SITE_URL).href,
          },
        },
      }),
      messaging.send({
        topic: "fr",
        notification: {
          title: args.frMessage.title,
          body: args.frMessage.body,
        },
        webpush: {
          fcmOptions: {
            link: new URL("/reward", process.env.SITE_URL).href,
          },
        },
      }),
    ]);
  },
});
