import { internal } from "~/_generated/api.js";
import { Id } from "~/_generated/dataModel.js";

import { getArtistsFromSheet } from "./utils/artistsSheet.js";
import { client } from "./utils/convexAdminClient.js";

const uploadUrl = await client.function(
  internal.utils.getUploadUrl,
  undefined,
  {},
);

const artists = await getArtistsFromSheet();

const booths = artists.filter((artist) => !!artist.boothName);

console.debug(booths);

const imagesStorageIds = new Map<string, Id<"_storage">>();

console.log("Uploading reward arts");
for (const artist of artists) {
  const storageId = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": artist.rewardCard.type },
    body: await artist.rewardCard.arrayBuffer(),
  })
    .then((res) => res.json())
    .then((data: { storageId: Id<"_storage"> }) => data.storageId);
  imagesStorageIds.set(artist.talentName, storageId);
}

const createdDesigns = await client.function(
  internal.utils.importCardDesigns,
  undefined,
  {
    designs: artists.map((artist) => ({
      artist: artist.artistName,
      talent: artist.talentName,
      image: imagesStorageIds.get(artist.talentName)!,
    })),
  },
);

console.log("Uploading profile pictures");
for (const booth of booths) {
  const storageId = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": booth.profilePicture.type },
    body: await booth.profilePicture.arrayBuffer(),
  })
    .then((res) => res.json())
    .then((data: { storageId: Id<"_storage"> }) => data.storageId);
  imagesStorageIds.set(booth.email, storageId);
}

const createdBooths = await client.function(
  internal.utils.importBooths,
  undefined,
  {
    booths: booths.map((booth) => ({
      name: booth.artistName,
      email: booth.email,
      description: booth.description + booth.showcase,
      hall: booth.hall,
      boothNumber: booth.boothNumber,
      links: {},
      image: imagesStorageIds.get(booth.email)!,
      cardDesign: createdDesigns[booth.talentName],
    })),
  },
);

for (const createdBooth of createdBooths) {
  console.log(
    createdBooth.email,
    createdBooth.accountPassword,
    createdBooth.boothId,
  );
}
