import { v } from "convex/values";

import { internal } from "./_generated/api.js";
import { action, internalMutation } from "./_generated/server.js";

export const addSubscription = internalMutation({
  args: {
    token: v.string(),
    language: v.union(v.literal("en"), v.literal("fr")),
  },
  handler: async (ctx, args) => {
    const existingSubscription = await ctx.db
      .query("pushTargets")
      .withIndex("by_fcm_token_and_topic", (q) =>
        q.eq("fcmToken", args.token).eq("topic", args.language),
      )
      .unique();
    if (existingSubscription) {
      return { alreadySubbed: true };
    }
    await ctx.db.insert("pushTargets", {
      fcmToken: args.token,
      topic: args.language,
    });
    return { alreadySubbed: false };
  },
});

export const removeSubscription = internalMutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const existingSubscriptions = await ctx.db
      .query("pushTargets")
      .withIndex("by_fcm_token", (q) => q.eq("fcmToken", args.token))
      .collect();
    for (const existingSubscription of existingSubscriptions) {
      await ctx.db.delete(existingSubscription._id);
    }
    if (existingSubscriptions.length) {
      return { wasSubbed: true };
    }
    return { wasSubbed: false };
  },
});

export const subscribeToNotifications = action({
  args: {
    token: v.string(),
    language: v.union(v.literal("en"), v.literal("fr")),
  },
  handler: async (ctx, args) => {
    const { alreadySubbed } = await ctx.runMutation(
      internal.notifications.addSubscription,
      args,
    );
    if (!alreadySubbed) {
      await ctx.runAction(internal.fcm.addTokenToFCM, {
        token: args.token,
        topic: args.language,
      });
    }
  },
});

export const unsubscribeFromNotifications = action({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const { wasSubbed } = await ctx.runMutation(
      internal.notifications.removeSubscription,
      args,
    );
    if (wasSubbed) {
      await ctx.runAction(internal.fcm.removeTokenFromFCM, {
        token: args.token,
      });
    }
  },
});
