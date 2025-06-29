import { Client, Databases, Query } from "node-appwrite";

import { GetAvailableCardsFunctionResponse } from "@vtube-stamp-rally/shared-lib/functions/getAvailableCards.ts";
import {
  Card,
  CardAvailable,
  Group,
} from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";
import { Context } from "@vtube-stamp-rally/shared-lib/types.ts";

const DATABASE_ID = process.env["DATABASE_ID"];
const CARDS_COLLECTION_ID = process.env["CARDS_COLLECTION_ID"];
const GROUPS_COLLECTION_ID = process.env["GROUPS_COLLECTION_ID"];
const CARD_DESIGNS_COLLECTION_ID = process.env["CARD_DESIGNS_COLLECTION_ID"];

export default async ({
  req,
  res,
  log,
}: Context<GetAvailableCardsFunctionResponse>) => {
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

  // 1. Trouver le groupe actif
  const groups = await db
    .listDocuments<Group>(DATABASE_ID, GROUPS_COLLECTION_ID)
    .then((res) => res.documents);

  if (groups.length === 0) {
    log("No active group found");
    return res.json({
      status: "error",
      message: "No active group found",
      error: "No active group found",
    });
  }

  const activeGroup = groups.find(
    (group) =>
      new Date(group.start).getTime() <= nowTime &&
      new Date(group.end).getTime() >= nowTime,
  );

  if (!activeGroup) {
    log("No active group found");
    return res.json({
      status: "error",
      message: "No active group found",
      error: "No active group found",
    });
  }

  const cards = await db
    .listDocuments<Card>(DATABASE_ID, CARDS_COLLECTION_ID, [
      Query.equal("group", activeGroup.$id),
      Query.equal("status", "available"),
      Query.limit(250),
    ])
    .then((res) => res.documents);

  const cardsReduced = cards.reduce(
    (acc, card) => {
      const existingCard = !!acc[card.cardDesign.$id] as boolean;

      if (!existingCard) {
        acc[card.cardDesign.$id] = {
          ...card.cardDesign,
          standist: undefined,
          classicStock: 0,
          holoStock: 0,
        };
      }

      if (card.type === "classic") {
        acc[card.cardDesign.$id].classicStock += 1;
      } else {
        acc[card.cardDesign.$id].holoStock += 1;
      }

      return acc;
    },
    {} as Record<string, CardAvailable>,
  );

  log(
    `Active group found: ${activeGroup.$id}, returning ${cards.length} cards`,
  );

  return res.json({
    status: "success",
    group: activeGroup,
    cards: Object.values(cardsReduced),
  });
};
