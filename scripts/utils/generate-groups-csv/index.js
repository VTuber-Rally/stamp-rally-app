#!/usr/bin/env node
import fs from "fs";

if (process.argv.length < 6) {
  console.error(
    "Usage: ./index.js <number of groups> <groups duration in minutes> <cards to distribute> <date of start> <outputFilePath>",
  );
  process.exit(1);
}

const numberOfGroups = parseInt(process.argv[2]);
if (isNaN(numberOfGroups) || numberOfGroups <= 0) {
  console.error(
    "Erreur: Le nombre de groupes doit être un nombre entier positif.",
  );
  process.exit(1);
}

const groupsDuration = parseInt(process.argv[3]);
if (isNaN(groupsDuration) || groupsDuration <= 0) {
  console.error(
    "Erreur: La durée des groupes en minutes doit être un nombre entier positif.",
  );
  process.exit(1);
}

const cardsToDistribute = parseInt(process.argv[4]);
if (isNaN(cardsToDistribute) || cardsToDistribute < 0) {
  console.error(
    "Erreur: Le nombre de cartes à distribuer doit être un nombre entier (0+)",
  );
  process.exit(1);
}

const dateOfStart = new Date(process.argv[5]);
if (isNaN(dateOfStart.getTime())) {
  console.error("Erreur: La date de début doit être une date valide");
  process.exit(1);
}

const outputFilePath = process.argv[6];

const groups = [];

for (let i = 0; i < numberOfGroups; i++) {
  groups.push({
    group: i + 1,
    start: new Date(dateOfStart.getTime() + i * groupsDuration * 60000),
    end: new Date(dateOfStart.getTime() + (i + 1) * groupsDuration * 60000),
    cards: cardsToDistribute,
    holoCards: i % 2 === 0 ? 2 : 0,
    coefficient: 1 / numberOfGroups,
  });
}

const output =
  "Groupe,Début,Fin,Nb cartes,Nb cartes Holo,Coefficient\n" +
  groups
    .map(
      (group) =>
        `${group.group},${group.start.toLocaleString("sv-SE", { timeZone: "Europe/Paris" }).replace(" ", "T")},${group.end.toLocaleString("sv-SE", { timeZone: "Europe/Paris" }).replace(" ", "T")},${group.cards},${group.holoCards},${group.coefficient}`,
    )
    .join("\n");

console.log(output);

fs.writeFileSync(outputFilePath, output);
