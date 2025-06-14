import { Client, Databases, Query } from "node-appwrite";

import { Card, Group } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";
import { Context } from "@vtube-stamp-rally/shared-lib/types.ts";

const DATABASE_ID = process.env["DATABASE_ID"];
const CARDS_COLLECTION_ID = process.env["CARDS_COLLECTION_ID"];
const GROUPS_COLLECTION_ID = process.env["GROUPS_COLLECTION_ID"];
const CARD_DESIGNS_COLLECTION_ID = process.env["CARD_DESIGNS_COLLECTION_ID"];

export default async ({
  req,
  res,
  log,
}: Context<{
  status: "success" | "error";
  message: string;
  error?: string;
}>) => {
  if (
    !DATABASE_ID ||
    !CARDS_COLLECTION_ID ||
    !GROUPS_COLLECTION_ID ||
    !CARD_DESIGNS_COLLECTION_ID
  ) {
    const missingVars = [];
    if (!DATABASE_ID) missingVars.push("DATABASE_ID");
    if (!CARDS_COLLECTION_ID) missingVars.push("CARDS_COLLECTION_ID");
    if (!GROUPS_COLLECTION_ID) missingVars.push("GROUPS_COLLECTION_ID");
    if (!CARD_DESIGNS_COLLECTION_ID)
      missingVars.push("CARD_DESIGNS_COLLECTION_ID");

    log(`Missing environment variables: ${missingVars.join(", ")}`);
    log(
      `Available environment variables: ${Object.keys(process.env).join(", ")}`,
    );
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
  }

  const client = new Client()
    .setEndpoint(process.env["APPWRITE_FUNCTION_API_ENDPOINT"]!)
    .setProject(process.env["APPWRITE_FUNCTION_PROJECT_ID"]!)
    .setKey(req.headers["x-appwrite-key"]);

  const db = new Databases(client);

  const now = new Date().toISOString();
  const nowDate = new Date(now);
  const nowTime = nowDate.getTime();

  const updateCard = async (card: Card, newGroupId: string) => {
    await db.updateDocument(DATABASE_ID, CARDS_COLLECTION_ID, card.$id, {
      group: newGroupId,
      cardHistory: [
        ...(card.cardHistory || []),
        {
          group: newGroupId,
          timestamp: now,
          type: "redistribution",
        },
      ],
      status: "available",
    });
  };

  // 1. Trouver les groupes à redistribuer
  const groups = await db
    .listDocuments<Group>(DATABASE_ID, GROUPS_COLLECTION_ID, [
      Query.equal("redistributed", false),
      Query.orderAsc("end"),
    ])
    .then((res) => res.documents);

  if (groups.length === 0) {
    log("No group found");
    return res.json({
      status: "error",
      message: "No group found",
      error: "No group found",
    });
  }

  // 2. Filtrer les groupes qui sont terminés et redistribuer les cartes
  const groupsToRedistribute = groups.filter((group) => {
    return new Date(group.end).getTime() < nowTime;
  });

  if (groupsToRedistribute.length === 0) {
    log("No group to redistribute");
    return res.json({
      status: "success",
      message: "No group to redistribute",
    });
  }

  const groupsToRedistributeTo = groups.filter((group) => {
    return new Date(group.end).getTime() > nowTime;
  });

  // 3. Redistribuer les cartes groupe par groupe (on devrait avoir max un seul groupe à redistribuer mais bon)
  for (const group of groupsToRedistribute) {
    const cards = await db
      .listDocuments<Card>(DATABASE_ID, CARDS_COLLECTION_ID, [
        Query.equal("group", group.$id),
        Query.equal("status", "available"),
        Query.limit(250),
      ])
      .then((res) => res.documents);

    log(
      `Redistributing ${cards.length} cards from expired group ${group.groupId}`,
    );

    if (cards.length === 0 || groupsToRedistributeTo.length === 0) {
      log("No cards to redistribute or no groups to redistribute to");
      continue; // on passe au groupe suivant
    }

    const classicCards = cards.filter((card) => card.type === "classic");
    const holoCards = cards.filter((card) => card.type === "holo");

    const classicCardsByDesign = Map.groupBy(
      classicCards,
      (card) => card.cardDesign.$id,
    );
    const holoCardsByDesign = Map.groupBy(
      holoCards,
      (card) => card.cardDesign.$id,
    );

    const cardsByDesignTyped = [classicCardsByDesign, holoCardsByDesign];

    // on redistribue les cartes par design linéairement sur les prochains groupes, avec rollover si on a plus de cartes à redistribuer que de groupes
    for (const cardsByDesign of cardsByDesignTyped) {
      log(
        `== New card type == Redistributing cards by card type, ${cardsByDesign.size} designs found`,
      );
      for (const [designId, cards] of cardsByDesign.entries()) {
        log(
          `Redistributing cards for design ${cards[0].cardDesign.name} (${designId}))`,
        );
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const groupId =
            groupsToRedistributeTo[i % groupsToRedistributeTo.length].$id;
          await updateCard(card, groupId);
        }
      }
    }

    await db.updateDocument(DATABASE_ID, GROUPS_COLLECTION_ID, group.$id, {
      redistributed: true,
    });
  }

  return res.json({
    status: "success",
    message: "Cards redistributed",
  });
};
