export const images = import.meta.glob("/src/assets/avatars/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const imagePrefix = "/src/assets/avatars/";
