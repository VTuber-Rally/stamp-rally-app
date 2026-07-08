import { createAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel.js";
import { internalAction, internalMutation } from "./_generated/server";
import { jsonWebKey } from "./validators.js";

export const getUploadUrl = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const insertBooth = internalMutation({
  args: {
    name: v.string(),
    description: v.string(),
    hall: v.string(),
    email: v.string(),
    boothNumber: v.string(),
    image: v.id("_storage"),
    links: v.record(v.string(), v.string()),
    privateKey: jsonWebKey,
    publicKey: jsonWebKey,
    cardDesign: v.id("cardDesigns"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("booths", {
      name: args.name,
      description: args.description,
      geometry: [],
      boothNumber: args.boothNumber,
      hall: args.hall,
      image: args.image,
      links: args.links,
      privateKey: args.privateKey,
      publicKey: args.publicKey,
      cardDesign: args.cardDesign,
    });
  },
});

export const importCardDesigns = internalMutation({
  args: {
    designs: v.array(
      v.object({
        talent: v.string(),
        artist: v.string(),
        image: v.id("_storage"),
        old: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const createdDesigns: Record<string, Id<"cardDesigns">> = {};
    for (const design of args.designs) {
      const createdId = await ctx.db.insert("cardDesigns", {
        artist: design.artist,
        image: design.image,
        name: design.talent,
        old: design.old,
      });
      createdDesigns[design.talent] = createdId;
    }
    return createdDesigns;
  },
});

export const importBooths = internalAction({
  args: {
    booths: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        hall: v.string(),
        email: v.string(),
        boothNumber: v.string(),
        image: v.id("_storage"),
        links: v.record(v.string(), v.string()),
        cardDesign: v.id("cardDesigns"),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const createdBooths: {
      email: string;
      accountPassword: string;
      boothId: Id<"booths">;
    }[] = [];
    for (const booth of args.booths) {
      const { privateKey, publicKey } = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-384" },
        true,
        ["sign", "verify"],
      );
      const exportedPrivateKey = await crypto.subtle.exportKey(
        "jwk",
        privateKey,
      );
      const exportedPublicKey = await crypto.subtle.exportKey("jwk", publicKey);

      const charset = "0123456789abcdefghijklmnopqrstuvwxyz";
      const passwordArray = new Uint8Array(24);
      crypto.getRandomValues(passwordArray);
      const password = passwordArray.reduce(
        (password, number) =>
          password + charset.charAt(number % charset.length),
        "",
      );

      const boothId = await ctx.runMutation(internal.utils.insertBooth, {
        ...booth,
        privateKey: exportedPrivateKey,
        publicKey: exportedPublicKey,
      });
      await createAccount(ctx, {
        provider: "password",
        account: {
          id: booth.email,
          secret: password,
        },
        profile: {
          name: booth.name,
          email: booth.email,
          boothId,
          role: "standist",
          isAnonymous: false,
        },
      });
      createdBooths.push({
        email: booth.email,
        accountPassword: password,
        boothId,
      });
    }
    return createdBooths;
  },
});

export const importGroups = internalMutation({
  args: {
    groups: v.array(
      v.object({
        indexNumber: v.number(),
        start: v.number(),
        end: v.number(),
        coefficient: v.number(),
        holographicCardsPerDesign: v.number(),
        classicCardsPerDesign: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const groups: Record<number, Id<"groups">> = {};
    for (const group of args.groups) {
      const createdGroupId = await ctx.db.insert("groups", {
        ...group,
        redistributed: false,
      });
      groups[group.indexNumber] = createdGroupId;
    }
    return groups;
  },
});

export const importCards = internalMutation({
  args: {
    items: v.array(
      v.object({
        designId: v.id("cardDesigns"),
        groupId: v.id("groups"),
        classicCards: v.number(),
        holographicCards: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      for (let i = 0; i < item.classicCards; i++) {
        const cardId = await ctx.db.insert("cards", {
          cardDesign: item.designId,
          group: item.groupId,
          isAvailable: true,
          type: "classic",
        });
        await ctx.db.insert("cardHistory", {
          card: cardId,
          timestamp: Date.now(),
          type: "initial",
          group: item.groupId,
        });
      }
      for (let i = 0; i < item.holographicCards; i++) {
        const cardId = await ctx.db.insert("cards", {
          cardDesign: item.designId,
          group: item.groupId,
          isAvailable: true,
          type: "holographic",
        });
        await ctx.db.insert("cardHistory", {
          card: cardId,
          timestamp: Date.now(),
          type: "initial",
          group: item.groupId,
        });
      }
    }
  },
});
