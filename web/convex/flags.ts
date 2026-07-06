import { v } from "convex/values";

import { query } from "./_generated/server.js";
import { getStaffLoggedInUser } from "./users.js";

export const getFlag = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("flags")
      .withIndex("by_key_and_public", (q) =>
        q.eq("key", args.key).eq("public", true),
      )
      .unique();
    if (!record)
      console.warn(
        `Flag ${args.key} was requested but doesn't exist in database. Consider creating it.`,
      );
    return record?.value;
  },
});

export const getPrivateFlag = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    await getStaffLoggedInUser(ctx);
    const record = await ctx.db
      .query("flags")
      .withIndex("by_key_and_public", (q) =>
        q.eq("key", args.key).eq("public", false),
      )
      .unique();
    if (!record)
      console.warn(
        `Flag ${args.key} was requested but doesn't exist in database. Consider creating it.`,
      );
    return record?.value;
  },
});
