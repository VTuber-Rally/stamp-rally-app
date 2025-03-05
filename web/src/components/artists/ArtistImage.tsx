import { useSuspenseQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { getArtistImage } from "@/lib/images";

export const ArtistImage = ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => {
  const { data: imageSrc } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.ARTIST_IMAGE, userId],
    queryFn: () => getArtistImage(userId),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // bon ok ça c'est du copilot
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (!imageSrc) return null;

  return (
    <img
      src={imageSrc}
      alt={name}
      className={"w-32 rounded-full border-8 border-secondary"}
    />
  );
};
