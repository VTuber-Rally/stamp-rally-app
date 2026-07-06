import { api, internal } from "~/_generated/api.js";
import type { Id } from "~/_generated/dataModel.js";

import { getCardStock, getSalesGroups } from "./utils/artistsSheet.js";
import { client } from "./utils/convexAdminClient.js";

const cardDesigns = await client.function(
  api.cards.listCardDesigns,
  undefined,
  {},
);

const salesGroups = await getSalesGroups();

const cardStock = await getCardStock();

// Map stock by design ID for quick lookup
const stockByDesignId = new Map<
  Id<"cardDesigns">,
  { classic: number; holographic: number }
>(
  cardStock.map((s) => [
    s.designId,
    { classic: s.classic, holographic: s.holographic },
  ]),
);

// Compute total coefficient across all groups
const totalCoefficient = salesGroups.reduce((sum, g) => sum + g.coefficient, 0);

/** Distribute a total count proportionally across groups by coefficient,
 *  using floor then distributing the remainder to the highest-coefficient groups. */
function distributeProportionally(
  total: number,
  totalCoeff: number,
): Map<number, number> {
  const result = new Map<number, number>();
  let distributed = 0;

  for (const group of salesGroups) {
    const share = Math.floor((total * group.coefficient) / totalCoeff);
    result.set(group.indexNumber, share);
    distributed += share;
  }

  // Distribute remainder to groups with highest coefficient first
  let remainder = total - distributed;
  const sortedByCoeff = [...salesGroups].sort(
    (a, b) => b.coefficient - a.coefficient,
  );
  for (const group of sortedByCoeff) {
    if (remainder <= 0) break;
    result.set(group.indexNumber, result.get(group.indexNumber)! + 1);
    remainder--;
  }

  return result;
}

// Use the first card design as reference for per-group card count fields
const firstDesign = cardDesigns[0];
const refStock = stockByDesignId.get(firstDesign._id);
if (!refStock) {
  throw new Error(
    `No stock found for first design "${firstDesign.name}" (${firstDesign._id})`,
  );
}

const groupsToCreate = salesGroups.map((g) => ({
  indexNumber: g.indexNumber,
  start: g.start,
  end: g.end,
  coefficient: g.coefficient,
  holographicCardsPerDesign: Math.floor(
    (refStock.holographic * g.coefficient) / totalCoefficient,
  ),
  classicCardsPerDesign: Math.floor(
    (refStock.classic * g.coefficient) / totalCoefficient,
  ),
}));

console.log("Creating groups...");
const createdGroups = await client.function(
  internal.utils.importGroups,
  undefined,
  {
    groups: groupsToCreate,
  },
);
console.log(
  "Groups created:",
  Object.entries(createdGroups).map(([idx, id]) => `#${idx} -> ${id}`),
);

// Build the items array for importCards
console.log("Computing card distribution...");
const importItems: {
  designId: Id<"cardDesigns">;
  groupId: Id<"groups">;
  classicCards: number;
  holographicCards: number;
}[] = [];

for (const design of cardDesigns) {
  const stock = stockByDesignId.get(design._id);
  if (!stock) {
    console.warn(`No stock found for design "${design.name}", skipping`);
    continue;
  }

  const classicDist = distributeProportionally(stock.classic, totalCoefficient);
  const holographicDist = distributeProportionally(
    stock.holographic,
    totalCoefficient,
  );

  for (const group of salesGroups) {
    importItems.push({
      designId: design._id,
      groupId: createdGroups[group.indexNumber],
      classicCards: classicDist.get(group.indexNumber)!,
      holographicCards: holographicDist.get(group.indexNumber)!,
    });
  }
}

console.log(
  `Creating ${importItems.length} card entries across ${cardDesigns.length} designs × ${salesGroups.length} groups...`,
);
await client.function(internal.utils.importCards, undefined, {
  items: importItems,
});

// Verify totals match stock exactly
console.log("Verifying card counts match stock...");
let allMatch = true;
for (const design of cardDesigns) {
  const stock = stockByDesignId.get(design._id);
  if (!stock) continue;

  const designItems = importItems.filter((i) => i.designId === design._id);
  const totalClassic = designItems.reduce((sum, i) => sum + i.classicCards, 0);
  const totalHolographic = designItems.reduce(
    (sum, i) => sum + i.holographicCards,
    0,
  );

  if (totalClassic !== stock.classic) {
    console.error(
      `❌ Classic card mismatch for "${design.name}": expected ${stock.classic}, got ${totalClassic}`,
    );
    allMatch = false;
  }
  if (totalHolographic !== stock.holographic) {
    console.error(
      `❌ Holographic card mismatch for "${design.name}": expected ${stock.holographic}, got ${totalHolographic}`,
    );
    allMatch = false;
  }
}

if (allMatch) {
  console.log("✅ All card counts match stock exactly.");
}

console.log("Done!");
