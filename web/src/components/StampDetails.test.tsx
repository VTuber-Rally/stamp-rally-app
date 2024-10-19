import { composeStories } from "@storybook/react";

import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";

import * as stories from "./StampDetails.stories";

const { PaperStamp, DigitalStamp } = composeStories(stories);

describe("StampDetails", () => {
  test("digital stamp: hould display correctly", async () => {
    const container = render(<DigitalStamp />);

    // get by data-test attribute
    const details = container.getByTestId("stamps-details");

    expect(details).toHaveProperty("open", false);

    const generationMessage = await container.findByText(
      "Digital stamp generated on July 30, 2024 at 1:23:16 PM",
    );

    expect(generationMessage).not.be.null;
  });

  test("paper stamp: should display correctly", async () => {
    const container = render(<PaperStamp />);

    const generationMessage = await container.findByText("Paper stamp");

    expect(generationMessage).not.be.null;
  });
});