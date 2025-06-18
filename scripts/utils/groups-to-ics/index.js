#!/usr/bin/env bun
import csv from "csv-parser";
import fs from "fs";
import { createEvents } from "ics";

if (process.argv.length < 3) {
  console.error("Usage: ./index.js <csvFilePath> <icsFilePath>");
  process.exit(1);
}

const csvFilePath = process.argv[2];
const icsFilePath = process.argv[3];

const events = [];

fs.createReadStream(csvFilePath)
  .pipe(csv({ separator: "," }))
  .on("data", (row) => {
    const event = {
      start: [
        parseInt(row.Début.substring(0, 4)),
        parseInt(row.Début.substring(5, 7)),
        parseInt(row.Début.substring(8, 10)),
        parseInt(row.Début.substring(11, 13)),
        parseInt(row.Début.substring(14, 16)),
      ],
      end: [
        parseInt(row.Fin.substring(0, 4)),
        parseInt(row.Fin.substring(5, 7)),
        parseInt(row.Fin.substring(8, 10)),
        parseInt(row.Fin.substring(11, 13)),
        parseInt(row.Fin.substring(14, 16)),
      ],
      title: `Groupe ${row.Groupe}`,
      description: `Nombre de cartes: ${row["Nb cartes"]}`,
    };
    events.push(event);
  })
  .on("end", () => {
    const { error, value } = createEvents(events);

    if (error) {
      console.error("Erreur lors de la création du fichier ICS:", error);
      return;
    }

    fs.writeFileSync(icsFilePath, value);
    console.log("Fichier ICS créé avec succès:", icsFilePath);
  });
