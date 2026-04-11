import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { QueryCtx, mutation, query } from "./_generated/server";

export async function getLoggedInUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  return userId !== null ? ctx.db.get(userId) : null;
}

export async function getNonAnonymousLoggedInUser(ctx: QueryCtx) {
  const user = await getLoggedInUser(ctx);
  if (!user) throw new ConvexError("Unauthenticated");
  if (user.isAnonymous) throw new ConvexError("User is anonymous");
  return user;
}

export async function getStandistOrStaffLoggedInUser(ctx: QueryCtx) {
  const user = await getNonAnonymousLoggedInUser(ctx);
  if (user.role !== "staff" && user.role !== "standist")
    throw new ConvexError("Insufficient permissions");
  return user;
}

export const loggedInUser = query({
  args: {},
  handler: getLoggedInUser,
});

export const updateMyProfile = mutation({
  args: {
    name: v.optional(v.string()),
    emailConsent: v.optional(v.boolean()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getNonAnonymousLoggedInUser(ctx);
    await ctx.db.patch("users", user._id, args);
    return true;
  },
});
