import { test, expect } from "vitest";

import { images } from "./images";

test("should have the correct number of images", async () => {
  expect(Object.keys(images).length).toBe(14);
});
