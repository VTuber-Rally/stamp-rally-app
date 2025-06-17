import { Client, Databases, Query } from "node-appwrite";

import { Card, Group } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";
import { Context } from "@vtube-stamp-rally/shared-lib/types.ts";

const DATABASE_ID = process.env["DATABASE_ID"] ?? "6675f377000709b0db07";
const CARDS_COLLECTION_ID = process.env["CARDS_COLLECTION_ID"] ?? "cards";
const GROUPS_COLLECTION_ID = process.env["GROUPS_COLLECTION_ID"] ?? "groups";
const CARD_DESIGNS_COLLECTION_ID =
  process.env["CARD_DESIGNS_COLLECTION_ID"] ?? "card_designs";

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
  }

  // 1. Trouver les groupes à redistribuer
  const groups = await db
    .listDocuments<Group>(DATABASE_ID, GROUPS_COLLECTION_ID, [
      Query.equal("redistributed", false),
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

  const groupesToRedistributeTo = groups.filter((group) => {
    return new Date(group.start).getTime() > nowTime || new Date(group.end).getTime() > nowTime;
  });

  // 3. Redistribuer les cartes groupe par groupe (on devrait avoir max un seul groupe à redistribuer mais bon)
  for (const group of groupsToRedistribute) {
    const cards = await db
      .listDocuments<Card>(DATABASE_ID, CARDS_COLLECTION_ID, [
        Query.equal("group", group.$id),
        Query.equal("status", "available"),
      ])
      .then((res) => res.documents);

    log(
      `Redistributing ${cards.length} cards from expired group ${group.groupId}`
    );

    if (cards.length > 0 && groupesToRedistributeTo.length > 0) {
      // Calculer la somme des coefficients des groupes de destination disponibles
      const totalCoefficient = groupesToRedistributeTo.reduce(
        (sum, targetGroup) => sum + targetGroup.coefficient,
        0
      );

      log(
        `Total coefficient of available destination groups: ${totalCoefficient}`
      );

      // Redistribuer les cartes selon les coefficients normalisés
      let cardIndex = 0;
      
      for (const targetGroup of groupesToRedistributeTo) {
        // Normaliser le coefficient pour qu'il soit sur base 1.0
        const normalizedCoefficient = targetGroup.coefficient / totalCoefficient;
        
        // Calculer le nombre de cartes pour ce groupe selon son coefficient normalisé
        const cardsForThisGroup = Math.floor(
          cards.length * normalizedCoefficient
        );

        log(
          `Group ${targetGroup.groupId} (coefficient: ${targetGroup.coefficient}, normalized: ${normalizedCoefficient.toFixed(3)}) will receive ${cardsForThisGroup} cards`
        );

        for (let j = 0; j < cardsForThisGroup && cardIndex < cards.length; j++) {
          const card = cards[cardIndex];
          await updateCard(card, targetGroup.$id);
          log(
            `Redistributed card ${card.$id} from group ${group.groupId} to group ${targetGroup.groupId}`
          );
          cardIndex++;
        }
      }

      // Redistribuer les cartes restantes aux groupes avec les coefficients les plus élevés
      const sortedByCoefficient = [...groupesToRedistributeTo].sort(
        (a, b) => b.coefficient - a.coefficient
      );

      let remainingGroupIndex = 0;
      while (cardIndex < cards.length) {
        const targetGroup = sortedByCoefficient[remainingGroupIndex % sortedByCoefficient.length];
        const card = cards[cardIndex];
        await updateCard(card, targetGroup.$id);
        log(
          `Redistributed remaining card ${card.$id} from group ${group.groupId} to group ${targetGroup.groupId} (highest coefficient)`
        );
        cardIndex++;
        remainingGroupIndex++;
      }

      log(
        `Successfully redistributed ${cardIndex} cards from group ${group.groupId}`
      );
    } else {
      log(
        `No cards to redistribute from group ${group.groupId} or no target groups available`
      );
    }

    // mark the group as redistributed
    await db.updateDocument(DATABASE_ID, GROUPS_COLLECTION_ID, group.$id, {
      redistributed: true,
    });
  }

  return res.json({
    status: "success",
    message: "Cards redistributed",
  });
};

