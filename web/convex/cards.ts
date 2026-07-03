import { ConvexError, v } from "convex/values";

import { Id } from "./_generated/dataModel.js";
import {
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server.js";

/**
 * Internal mutation that redistributes cards from expired groups to future
 * groups. Cards are distributed round-robin by design across all future groups.
 *
 * This is intended to be called on a cron schedule via `convex/crons.ts`.
 */
export const redistribute = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // 1. Get all groups and sort in-memory by end date ascending
    const groups = await ctx.db.query("groups").collect();
    groups.sort((a, b) => a.end - b.end);

    if (groups.length === 0) {
      console.log("No groups found");
      return { status: "error", message: "No groups found" } as const;
    }

    // 2. Split into expired (end < now) and future (end > now) groups
    const expiredGroups = groups.filter((g) => g.end < now);
    const futureGroups = groups.filter((g) => g.end > now);

    if (expiredGroups.length === 0) {
      console.log("No groups to redistribute");
      return {
        status: "success",
        message: "No groups to redistribute",
      } as const;
    }

    if (futureGroups.length === 0) {
      console.log("No future groups to redistribute to");
      return {
        status: "success",
        message: "No future groups to redistribute to",
      } as const;
    }

    // 3. Redistribute cards per expired group
    for (const group of expiredGroups) {
      if (group.redistributed) {
        console.log(`Group ${group._id} already redistributed, skipping`);
        continue;
      }

      const availableCards = await ctx.db
        .query("cards")
        .withIndex("by_group_available", (q) =>
          q.eq("group", group._id).eq("isAvailable", true),
        )
        .collect();

      console.log(
        `Redistributing ${availableCards.length} cards from expired group ${group._id}`,
      );

      if (availableCards.length === 0) {
        console.log("No cards to redistribute in this group");
        await ctx.db.patch(group._id, { redistributed: true });
        continue;
      }

      // Split by card type
      const classicCards = availableCards.filter((c) => c.type === "classic");
      const holoCards = availableCards.filter((c) => c.type === "holographic");

      // Group cards by design (in-memory)
      const groupByDesign = (cards: typeof classicCards) => {
        const map = new Map<string, (typeof cards)[0][]>();
        for (const card of cards) {
          const designId = card.cardDesign;
          const arr = map.get(designId) ?? [];
          arr.push(card);
          map.set(designId, arr);
        }
        return map;
      };

      const classicByDesign = groupByDesign(classicCards);
      const holoByDesign = groupByDesign(holoCards);

      // Redistribute each design group round-robin across future groups
      for (const [label, cardsByDesign] of [
        ["classic", classicByDesign],
        ["holographic", holoByDesign],
      ] as const) {
        console.log(
          `Redistributing ${label} cards, ${cardsByDesign.size} designs found`,
        );

        for (const [designId, designCards] of cardsByDesign.entries()) {
          console.log(
            `Redistributing ${designCards.length} cards for design ${designId}`,
          );

          for (let i = 0; i < designCards.length; i++) {
            const card = designCards[i];
            const targetGroupId = futureGroups[i % futureGroups.length]._id;

            // Update the card's group
            await ctx.db.patch(card._id, {
              group: targetGroupId,
              isAvailable: true,
            });

            // Record the redistribution in the history table
            await ctx.db.insert("cardHistory", {
              card: card._id,
              group: targetGroupId,
              type: "redistributed",
              timestamp: now,
            });
          }
        }
      }

      // Mark the expired group as redistributed
      await ctx.db.patch(group._id, { redistributed: true });
      console.log(`Marked group ${group._id} as redistributed`);
    }

    return { status: "success", message: "Cards redistributed" } as const;
  },
});

async function getCardDesigns(ctx: QueryCtx) {
  const cardDesigns = await ctx.db
    .query("cardDesigns")
    .withIndex("by_id")
    .order("asc")
    .collect();
  return Promise.all(
    cardDesigns.map(async (cardDesign) => {
      return {
        _id: cardDesign._id,
        name: cardDesign.name,
        artist: cardDesign.artist,
        imageUrl: (await ctx.storage.getUrl(cardDesign.image))!,
      };
    }),
  );
}

export const listCardDesigns = query({
  args: {},
  handler: (ctx) => getCardDesigns(ctx),
});

export const listAvailableCards = query({
  args: {},
  handler: async (ctx) => {
    const activeGroup = await ctx.db
      .query("groups")
      .filter((q) =>
        q.and(
          q.lte(q.field("start"), Date.now()),
          q.gte(q.field("end"), Date.now()),
        ),
      )
      .unique();

    if (!activeGroup) {
      throw new ConvexError("There is no active group");
    }

    const cardDesigns = await getCardDesigns(ctx);

    const availableCards = await ctx.db
      .query("cards")
      .withIndex("by_group_available", (q) =>
        q.eq("group", activeGroup._id).eq("isAvailable", true),
      )
      .collect();

    const cardsReduced = availableCards.reduce(
      (acc, card) => {
        const existingCard = !!acc[card.cardDesign] as boolean;

        if (!existingCard) {
          const cardDesign = cardDesigns.find(
            (cardDesign) => cardDesign._id === card.cardDesign,
          );
          if (!cardDesign)
            throw new ConvexError("A card is not bound to its design");

          acc[card.cardDesign] = {
            ...cardDesign,
            classicStock: 0,
            holoStock: 0,
          };
        }

        if (card.type === "classic") {
          acc[card.cardDesign].classicStock += 1;
        } else {
          acc[card.cardDesign].holoStock += 1;
        }

        return acc;
      },
      {} as Record<
        Id<"cardDesigns">,
        (typeof cardDesigns)[0] & { classicStock: number; holoStock: number }
      >,
    );

    return { activeGroup, cards: Object.values(cardsReduced) };
  },
});

export const sellCards = mutation({
  args: {
    cards: v.array(
      v.object({
        design: v.id("cardDesigns"),
        classic: v.number(),
        holo: v.number(),
      }),
    ),
    submission: v.optional(v.id("submissions")),
  },
  handler: async (ctx, args) => {
    const activeGroup = await ctx.db
      .query("groups")
      .filter((q) =>
        q.and(
          q.lte(q.field("start"), Date.now()),
          q.gte(q.field("end"), Date.now()),
        ),
      )
      .unique();

    if (!activeGroup) {
      throw new ConvexError("There is no active group");
    }

    const availableCards = await ctx.db
      .query("cards")
      .withIndex("by_group_available", (q) =>
        q.eq("group", activeGroup._id).eq("isAvailable", true),
      )
      .collect();

    const orderedCards: [Id<"cardDesigns">, "classic" | "holographic"][] = [];
    for (const orderItem of args.cards) {
      for (let i = 0; i < orderItem.classic; i++) {
        orderedCards.push([orderItem.design, "classic"]);
      }
      for (let i = 0; i < orderItem.holo; i++) {
        orderedCards.push([orderItem.design, "holographic"]);
      }
    }

    const cardsToSell: Id<"cards">[] = [];

    for (const card of availableCards) {
      if (!orderedCards.length) break;

      const foundOrder = orderedCards.findIndex(
        ([cardDesign, type]) =>
          card.cardDesign === cardDesign && card.type === type,
      );
      if (foundOrder === -1) {
        break;
      }

      orderedCards.splice(foundOrder, 1);
      cardsToSell.push(card._id);
    }

    for (const card of cardsToSell) {
      await Promise.all([
        ctx.db.patch("cards", card, {
          isAvailable: false,
        }),
        ctx.db.insert("cardHistory", {
          card,
          type: "sold",
          timestamp: Date.now(),
          submission: args.submission,
        }),
      ]);
    }
  },
});
