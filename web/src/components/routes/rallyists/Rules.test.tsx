import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import * as stories from "./Rules.stories";

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
