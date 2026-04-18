import { internal } from "~/_generated/api.js";
import { Id } from "~/_generated/dataModel.js";

import { getArtistsFromSheet } from "./utils/artistsSheet.js";
import { client } from "./utils/convexAdminClient.js";

const uploadUrl = await client.function(
  internal.utils.getUploadUrl,
  undefined,
  {},
);

const booths = await getArtistsFromSheet();

const imagesStorageIds = new Map<string, Id<"_storage">>();

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
