import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { getNonAnonymousLoggedInUser, getStaffLoggedInUser } from "./users";

export const getMyParticipation = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    return await ctx.db
      .query("contestParticipations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
  },
});

export const getParticipants = query({
  args: {},
  handler: async (ctx) => {
    await getStaffLoggedInUser(ctx);

    return await ctx.db
      .query("contestParticipations")
      .withIndex("by_is_drawn_registered_at", (q) => q.eq("isDrawn", false))
      .order("desc")
      .collect();
  },
});

export const getLastWinners = query({
  args: {},
  handler: async (ctx) => {
    await getStaffLoggedInUser(ctx);

    return await ctx.db
      .query("contestParticipations")
      .withIndex("by_is_winner_drawn_at", (q) => q.eq("isWinner", true))
      .order("desc")
      .collect();
  },
});

export const registerParticipant = mutation({
  args: {
    secret: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getNonAnonymousLoggedInUser(ctx);

    // Validate the registration secret against the stored flag
    const secretFlag = await ctx.db
      .query("flags")
      .withIndex("by_key_and_public", (q) =>
        q.eq("key", "contestRegistrationSecret").eq("public", false),
      )
      .unique();

    if (!secretFlag || secretFlag.value !== args.secret) {
      throw new ConvexError("contest.registration.invalidSecret");
    }

    const validSubmissions = await ctx.db
      .query("submissions")
      .withIndex("by_user_redeemed", (q) => q.eq("userId", user._id))
      .collect();
    const validSubmissionsCount = validSubmissions.length;

    // Count existing participations for this user
    const existingParticipationsCount = (
      await ctx.db
        .query("contestParticipations")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect()
    ).length;

    if (validSubmissionsCount <= existingParticipationsCount) {
      throw new ConvexError("contest.registration.noSubmissions");
    }

    // Insert the new participation
    const participationId = await ctx.db.insert("contestParticipations", {
      userId: user._id,
      name: user.name ?? user.email ?? user?._id,
      registeredAt: Date.now(),
      isWinner: false,
      isDrawn: false,
    });

    return participationId;
  },
});

/**
 * Staff only — marks a single participation as a winner by setting
 * `isWinner: true` and `drawnAt` to the current timestamp.
 */
export const markWinner = mutation({
  args: {
    participationId: v.id("contestParticipations"),
  },
  handler: async (ctx, args) => {
    await getStaffLoggedInUser(ctx);

    await ctx.db.patch("contestParticipations", args.participationId, {
      isWinner: true,
      isDrawn: true,
      drawnAt: Date.now(),
    });
  },
});

/**
 * Staff only — marks a batch of participations as drawn (without marking them
 * as winners). Skips any participation that already has a `drawnAt` value.
 */
export const markAllDrawn = mutation({
  args: {
    participationIds: v.array(v.id("contestParticipations")),
  },
  handler: async (ctx, args) => {
    await getStaffLoggedInUser(ctx);

    const now = Date.now();

    for (const participationId of args.participationIds) {
      const participation = await ctx.db.get(
        "contestParticipations",
        participationId,
      );
      // Skip participations that have already been drawn
      if (!participation || participation.isDrawn) continue;

      await ctx.db.patch("contestParticipations", participationId, {
        isDrawn: true,
        drawnAt: now,
      });
    }
  },
});

/**
 * Staff only — generates a new random secret and upserts the
 * `contestRegistrationSecret` flag with it.
 *
 * Returns the newly generated secret so it can be shown to the staff member.
 */
export const resetContestSecret = action({
  args: {},
  handler: async (ctx) => {
    // Generate a random secret (URL-safe base64, 32 bytes of entropy)
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    const secret = btoa(String.fromCharCode(...randomBytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Call the internal mutation to upsert the flag
    await ctx.runMutation(internal.contest.upsertContestSecret, { secret });

    return secret;
  },
});

/**
 * Internal mutation to upsert the contest registration secret.
 * This is called by the resetContestSecret action.
 */
export const upsertContestSecret = internalMutation({
  args: {
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    await getStaffLoggedInUser(ctx);

    // Upsert the flag
    const existing = await ctx.db
      .query("flags")
      .withIndex("by_key_and_public", (q) =>
        q.eq("key", "contestRegistrationSecret"),
      )
      .unique();

    if (existing) {
      await ctx.db.patch("flags", existing._id, { value: args.secret });
    } else {
      await ctx.db.insert("flags", {
        key: "contestRegistrationSecret",
        value: args.secret,
        public: false,
      });
    }
  },
});
