export function bytesToBase64DataUrl(
  bytes: ArrayBuffer,
  type = "application/octet-stream",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(new File([bytes], "", { type }));
  });
}

export async function dataUrlToBytes(dataUrl: string) {
  const res = await fetch(dataUrl);
  return res.arrayBuffer();
}
