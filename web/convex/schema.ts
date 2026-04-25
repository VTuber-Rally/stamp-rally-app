import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { jsonWebKey, polygonGeometry } from "./validators.js";

const userId = v.id("users");

export default defineSchema({
  booths: defineTable({
    name: v.string(),
    description: v.string(),
    hall: v.string(),
    boothNumber: v.string(),
    geometry: polygonGeometry,
    image: v.id("_storage"),
    publicKey: jsonWebKey,
    privateKey: jsonWebKey,
    links: v.record(v.string(), v.string()),
  }).index("by_name", ["name"]),

  flags: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  stamps: defineTable({
    booth: v.id("booths"),
    scannedAt: v.number(),
    expiredAt: v.number(),
    signature: v.string(),
    submission: v.id("submission"),
  }).index("by_submisssion", ["submission"]),

  submissions: defineTable({
    redeemed: v.boolean(),
    submittedAt: v.number(),
    userId,
  }).index("by_user", ["userId"]),

  prizes: defineTable({
    probability: v.number(),
    draw: v.union(v.literal("standard"), v.literal("premium")),
    classicCards: v.number(),
    holographicCards: v.number(),
  }),

  contestParticipations: defineTable({
    userId,
    name: v.string(),
    registeredAt: v.number(),
    drawnAt: v.number(),
    isWinner: v.boolean(),
  }),

  // Stock
  cardDesigns: defineTable({
    name: v.string(),
    artist: v.string(),
    image: v.id("_storage"),
    booth: v.id("booths"),
  }),

  groups: defineTable({
    indexNumber: v.number(),
    coefficient: v.number(),
    start: v.number(),
    end: v.number(),
    classicCardsPerDesign: v.number(),
    holographicCardsPerDesign: v.number(),
    redistributed: v.boolean(),
  }),

  cards: defineTable({
    cardDesign: v.id("cardDesigns"),
    isAvailable: v.boolean(),
    type: v.union(v.literal("classic"), v.literal("holographic")),
    group: v.id("groups"),
  }).index("by_group", ["group"]),

  cardHistory: defineTable({
    card: v.id("cards"),
    submission: v.optional(v.id("submission")),
    group: v.optional(v.id("group")),
    type: v.union(
      v.literal("initial"),
      v.literal("redistributed"),
      v.literal("sold"),
      v.literal("moved"),
    ),
    timestamp: v.number(),
  }),

  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // other "users" fields...
    role: v.optional(
      v.union(v.literal("user"), v.literal("standist"), v.literal("staff")),
    ),
    boothId: v.optional(v.id("booths")),
    language: v.optional(v.string()),
    emailConsent: v.optional(v.boolean()),
  }).index("email", ["email"]),

  pushTargets: defineTable({
    fcmToken: v.string(),
    topic: v.union(v.literal("fr"), v.literal("en")),
  })
    .index("by_fcm_token", ["fcmToken"])
    .index("by_fcm_token_and_topic", ["fcmToken", "topic"]),
});
