import { Client, Databases, Query } from "node-appwrite";

import {
  SellCardsFunctionRequestValidator,
  SellCardsFunctionResponse,
} from "@vtube-stamp-rally/shared-lib/functions/sellCards.ts";
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
}: Context<SellCardsFunctionResponse>) => {
  const createNoActiveGroupErrorResponse = () => {
    log("No active group found");
    return res.json({
      status: "error",
      message: "No active group found",
      error: "No active group found",
    });
  };

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

  const {
    success: isDataValid,
    data: inputData,
    error: parseError,
  } = SellCardsFunctionRequestValidator.safeParse(JSON.parse(req.body));

  if (!isDataValid) {
    log(`Invalid request data: ${parseError.message}`);
    return res.send(
      JSON.stringify({
        status: "error",
        message: "Invalid request data",
        error: parseError.message,
      }),
      400,
      [{ "Content-Type": "application/json" }],
    );
  }

  const { submissionId, orderedCards } = inputData;
  log(`Received submissionId: ${submissionId}`);
  // cardDesigns: {     type: "classic" | "holo"     cardDesignId: string     quantity: number   }[]

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
    return createNoActiveGroupErrorResponse();
  }

  const activeGroup = groups.find(
    (group) =>
      new Date(group.start).getTime() <= nowTime &&
      new Date(group.end).getTime() >= nowTime,
  );

  if (!activeGroup) {
    return createNoActiveGroupErrorResponse();
  }

  const updatePromises: Promise<Card>[] = [];

  for (const orderedCard of orderedCards) {
    // pour chaque design/type (orderedCard), on va vérifier le stock (au cas où), et s'il y a assez de résultat, marquer les cartes comme vendues
    const { cardDesignId, type, quantity } = orderedCard;
    const cards = await db
      .listDocuments<Card>(DATABASE_ID, CARDS_COLLECTION_ID, [
        Query.equal("group", activeGroup.$id),
        Query.equal("cardDesign", cardDesignId),
        Query.equal("type", type),
        Query.equal("status", "available"),
        Query.limit(quantity),
      ])
      .then((res) => res.documents);

    log(
      `Found ${cards.length} available cards for design ${cardDesignId} of type ${type}. Requested: ${quantity}`,
    );

    // si on manque de stock (si le client n'était pas à jour)
    if (cards.length < quantity) {
      log(
        `Not enough cards available for design ${cardDesignId} of type ${type}. Requested: ${quantity}, Available: ${cards.length}`,
      );
      return res.json({
        status: "error",
        message: `Not enough cards available for design ${cardDesignId} of type ${type}. Requested: ${quantity}, Available: ${cards.length}`,
        error: "Not enough cards available",
      });
    }

    // on marque les cartes comme vendues
    updatePromises.push(
      ...cards.map(async (card) => {
        return db.updateDocument<Card>(
          DATABASE_ID,
          CARDS_COLLECTION_ID,
          card.$id,
          {
            status: "sold",
            cardHistory: [
              ...(card.cardHistory || []),
              {
                group: activeGroup,
                timestamp: now,
                type: "sold",
                submission: submissionId,
              },
            ],
          },
        );
      }),
    );
  }

  const cards = await Promise.all(updatePromises);

  return res.json({
    status: "success",
    soldCards: cards.length,
  });
};
