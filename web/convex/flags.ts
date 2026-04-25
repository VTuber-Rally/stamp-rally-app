import { v } from "convex/values";

import { query } from "./_generated/server.js";

export const getFlag = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("flags")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    return record?.value;
  },
});
