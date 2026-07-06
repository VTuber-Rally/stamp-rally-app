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
