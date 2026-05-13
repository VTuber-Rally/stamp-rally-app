import { google } from "googleapis";

import { scriptEnv } from "./env.js";

// Use gcloud --impersonate-service-account=boothimport@vtuberstamprally.iam.gserviceaccount.com auth application-default login --scopes="https://www.googleapis.com/auth/spreadsheets.readonly,https://www.googleapis.com/auth/drive.readonly,https://www.googleapis.com/auth/cloud-platform"
// to get a Sheets/Drive read token
const auth = new google.auth.GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
  ],
});
const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });
const spreadsheetId = scriptEnv.ARTISTS_SPREADSHEET_ID;

export interface SheetBooth {
  email: string;
  artistName: string;
  boothName: string;
  boothNumber: string;
  hall: string;
  description: string;
  showcase: string;
  socials: string;
  talents: string;
  pronouns: string;
  alreadyPresent: boolean;
  profilePicture: Blob;
}

export async function getArtistsFromSheet() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Artists!B2:W",
  });

  const booths: SheetBooth[] = [];

  for (const line of response.data.values!) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [
      artistName,
      email,
      boothName,
      boothNumber,
      hall,
      talentName,
      talentAlreadyPresent,
      sentFile,
      alreadyPresent,
      description,
      showcase,
      socials,
      talents,
      privacy,
      pronouns,
      profilePicture,
      promoArtwork,
      boothRegistration,
      profilePictureURL,
      profilePictureId,
      promoArtworkURL,
      promoArtworkId,
    ] = line as string[];
    /* eslint-enable @typescript-eslint/no-unused-vars */

    if (!profilePictureId) {
      console.warn(
        "Artist",
        artistName,
        "was ignored, please add profile picture",
      );
      continue;
    }

    console.log(line);

    const file = await drive.files.get(
      {
        fileId: profilePictureId,
        alt: "media",
      },
      { responseType: "blob" },
    );
    const imageBlob = file.data as unknown as Blob;

    const booth = {
      email,
      artistName,
      boothName,
      boothNumber,
      hall,
      description,
      showcase,
      socials,
      talents,
      pronouns,
      alreadyPresent: alreadyPresent === "TRUE",
      profilePicture: imageBlob,
    };

    booths.push(booth);
  }

  console.debug(
    "Loaded artists from sheet",
    JSON.stringify(booths.map((booth) => booth.artistName)),
  );

  return booths;
}
