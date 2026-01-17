import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const jsonWebKey = v.object({
  crv: v.string(),
  ext: v.boolean(),
  key_ops: v.array(v.string()),
  kty: v.string(),
  x: v.string(),
  y: v.string(),
});

const polygonGeometry = v.array(v.array(v.array(v.float64())));

export default defineSchema({
  booths: defineTable({
    name: v.string(),
    description: v.string(),
    hall: v.string(),
    boothNumber: v.string(),
    geometry: polygonGeometry,
    image: v.string(),
    publicKey: jsonWebKey,
    links: v.record(v.string(), v.string()),
    userId: v.string(),
  }),
});
