import { useQuery } from "@tanstack/react-query";
import { Standist, importJWK } from "shared-lib";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { databases } from "@/lib/appwrite.ts";
import { databaseId, standistsCollectionId } from "@/lib/consts.ts";
import { db } from "@/lib/db.ts";
import { queryClient } from "@/lib/queryClient.ts";

const importStandists = async (): Promise<Standist[]> => {
  const { documents: standists } = await databases.listDocuments(
    databaseId,
    standistsCollectionId,
  );

  const artists = await Promise.all(
    standists.map(async (document) => {
      const {
        userId,
        publicKey,
        name,
        hall,
        boothNumber,
        description,
        image,
        twitter,
        instagram,
        twitch,
        geometry,
      } = document;
      return {
        userId,
        publicKey: await importJWK(JSON.parse(publicKey)),
        name,
        hall,
        boothNumber,
        description,
        image,
        twitter,
        instagram,
        twitch,
        geometry: JSON.parse(geometry),
      } as Standist;
    }),
  );

  artists.sort((a, b) => a.userId.localeCompare(b.userId));

  // voluntary not waiting for the clear to finish
  db.standists.clear().then(() => {
    db.standists.bulkAdd(artists);
  });

  return artists;
};

const existingStandistsList: Standist[] = await db.standists.toArray();

const standistQuery = {
  queryKey: [QUERY_KEYS.ARTISTS],
  staleTime: Infinity,
  queryFn: importStandists,
};

export const prefetchStandists = () => {
  queryClient.prefetchQuery(standistQuery);
};

export const useStandists = () => {
  const { isLoading, isError, data } = useQuery(standistQuery);

  // if we are still loading or have no data, fallback to the existing list
  if (isLoading || isError || !data) {
    return { isLoading: false, data: existingStandistsList };
  }

  return { isLoading, data };
};

export const getStandists = () => queryClient.ensureQueryData(standistQuery);
