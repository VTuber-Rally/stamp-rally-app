export async function dataUrlToBytes(dataUrl: string) {
  const res = await fetch(dataUrl);
  return res.arrayBuffer();
}
