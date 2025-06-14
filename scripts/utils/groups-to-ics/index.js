#!/usr/bin/env bun
import csv from "csv-parser";
import { parse } from "date-fns";
import fs from "fs";
import { createEvents } from "ics";

if (process.argv.length < 3) {
  console.error("Usage: ./index.js <csvFilePath> <icsFilePath>");
  process.exit(1);
}

const csvFilePath = process.argv[2];
const icsFilePath = process.argv[3];

function parseDateToArray(dateString) {
  const date = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
  return [
    date.getFullYear(),
    date.getMonth() + 1, // getMonth retourne 0-11, ics attend 1-12, javascript c'est mal foutu
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
}

const events = [];

fs.createReadStream(csvFilePath)
  .pipe(csv({ separator: "," }))
  .on("data", (row) => {
    const event = {
      start: parseDateToArray(row.Début),
      end: parseDateToArray(row.Fin),
      title: `Groupe ${row.Groupe}`,
      description: `Nombre de cartes: ${row["Nb cartes"]}, holo: ${row["Nb cartes Holo"]}, coefficient: ${row.Coefficient}`,
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
