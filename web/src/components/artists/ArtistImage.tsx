import { useSuspenseQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { getArtistImage } from "@/lib/images";

export const ArtistImage = ({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) => {
  return (
    <img
      src={imageUrl}
      alt={name}
      className={
        "h-32 w-32 rounded-full border-8 border-secondary object-cover"
      }
    />
  );
};
