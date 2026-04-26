import { ConvexError, v } from "convex/values";

import { DataModel, Id } from "./_generated/dataModel.js";
import { mutation, query } from "./_generated/server.js";
import { getLoggedInUser } from "./users.js";

const textEncoder = new TextEncoder();

const jwkAlgorithm = { name: "ECDSA", namedCurve: "P-384" } as const;

const signAlgorithm = {
  name: "ECDSA",
  hash: { name: "SHA-384" },
} as const;

export const importJWK = (jwk: JsonWebKey, sign = false) =>
  crypto.subtle.importKey(
    "jwk",
    jwk,
    jwkAlgorithm,
    false,
    sign ? ["sign"] : ["verify"],
  );

type SubmitRallyResponse =
  | { status: "error"; message: string }
  | { status: "success"; submissionId: Id<"submissions"> };

export const submitRally = mutation({
  args: {
    stamps: v.array(
      v.object({
        boothId: v.id("booths"),
        expiryTimestamp: v.number(),
        scanTimestamp: v.number(),
        signature: v.bytes(),
      }),
    ),
  },
  returns: v.union(
    v.object({
      status: v.literal("success"),
      submissionId: v.id("submissions"),
    }),
    v.object({
      status: v.literal("error"),
      message: v.string(),
    }),
  ),
  handler: async (ctx, args): Promise<SubmitRallyResponse> => {
    const user = await getLoggedInUser(ctx);
    if (!user) throw new ConvexError("Unauthenticated");
    const booths = await ctx.db.query("booths").collect();

    const stamps: Omit<
      DataModel["stamps"]["document"],
      "_id" | "_creationTime" | "submission"
    >[] = [];

    // Pre-flight checks
    for (const stamp of args.stamps) {
      const booth = booths.find((booth) => booth._id === stamp.boothId);
      if (!booth) {
        return {
          status: "error",
          message: "Unknown booth ID " + stamp.boothId,
        };
      }

      const isSignatureValid = await crypto.subtle.verify(
        signAlgorithm,
        await importJWK(booth.publicKey),
        stamp.signature,
        textEncoder.encode([stamp.boothId, stamp.expiryTimestamp].join(":")),
      );

      if (!isSignatureValid) {
        return {
          status: "error",
          message: "At least one stamp signature is invalid",
        };
      }

      const alreadyExistingStamp = await ctx.db
        .query("stamps")
        .withIndex("by_booth_and_scanned_at", (q) =>
          q.eq("booth", booth._id).eq("scannedAt", stamp.scanTimestamp),
        )
        .first();

      if (alreadyExistingStamp) {
        return {
          status: "error",
          message: "At least one stamp was already used to submit",
        };
      }

      stamps.push({
        booth: booth._id,
        scannedAt: stamp.scanTimestamp,
        expiredAt: stamp.expiryTimestamp,
        signature: stamp.signature,
      });
    }

    const submissionId = await ctx.db.insert("submissions", {
      redeemed: false,
      submittedAt: Date.now(),
      userId: user._id,
      stampsCount: stamps.length,
    });

    for (const stamp of stamps) {
      await ctx.db.insert("stamps", {
        ...stamp,
        submission: submissionId,
      });
    }

    return { status: "success", submissionId };
  },
});

export const getMySubmissions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getLoggedInUser(ctx);
    if (!user) return [];

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return submissions;
  },
});
