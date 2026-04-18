import { v } from "convex/values";

export const jsonWebKey = v.object({
  crv: v.optional(v.string()),
  ext: v.optional(v.boolean()),
  key_ops: v.optional(v.array(v.string())),
  kty: v.optional(v.string()),
  x: v.optional(v.string()),
  y: v.optional(v.string()),
  d: v.optional(v.string()),
});
export const polygonGeometry = v.array(v.array(v.array(v.float64())));
