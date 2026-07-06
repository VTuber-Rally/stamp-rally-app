import { ConvexError, v } from "convex/values";

import type { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getStandistOrStaffLoggedInUser } from "./users.js";

type Booth = DataModel["booths"]["document"];

function omitBoothPrivateFields(booth: Booth) {
  return { ...booth, privateKey: undefined };
}

export const listBooths = query({
  args: {},
  handler: async (ctx) => {
    const booths = await ctx.db
      .query("booths")
      .withIndex("by_name")
      .order("asc")
      .collect();
    return Promise.all(
      booths.map(async (booth) => {
        const publicBooth = omitBoothPrivateFields(booth);
        const publicBoothWithImageURL = {
          ...publicBooth,
          imageUrl: (await ctx.storage.getUrl(booth.image))!,
        };
        return publicBoothWithImageURL;
      }),
    );
  },
});

export const getBoothWithPrivateKey = query({
  args: { boothId: v.id("booths") },
  handler: async (ctx, args) => {
    const user = await getStandistOrStaffLoggedInUser(ctx);

    if (user.role === "standist" && args.boothId !== user.boothId)
      throw new ConvexError("User is not allowed to get this booth details");

    const booth = await ctx.db.get("booths", args.boothId);
    return booth;
  },
});

export const updateBoothProfile = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    links: v.object({
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      twitch: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getStandistOrStaffLoggedInUser(ctx);

    if (!user.boothId)
      throw new ConvexError("User does not have an associated booth");

    const { links, ...rest } = args;

    const cleanedLinks = Object.fromEntries(
      Object.entries(links).filter(([, v]) => v !== undefined && v !== ""),
    );

    await ctx.db.patch("booths", user.boothId, {
      ...rest,
      links: cleanedLinks,
    });
  },
});
