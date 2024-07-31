import { describe, expect, test } from "vitest";
import { composeStories } from "@storybook/react";

import * as stories from "./Rules.stories";
import { render } from "@testing-library/react";

const { Default } = composeStories(stories);

describe("Rallyists Rules", () => {
  test("should have the correct number of rules", async () => {
    const container = render(<Default />);

    const lists = container.getAllByRole("list");

    expect(lists.length).toBe(2);

    const texts = lists.map((list) => list.querySelectorAll("li"));

    expect(texts[0].length).toBe(6);

    expect(texts[1].length).toBe(9);
  });
});
