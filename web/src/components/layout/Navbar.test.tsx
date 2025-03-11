import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import * as RallyistsNavbarStories from "./Navbar.RallyistNavbar.stories.tsx";
import * as StaffNavbarStories from "./Navbar.StaffNavbar.stories.tsx";
import * as StandistsNavbarStories from "./Navbar.StandistsNavbar.stories.tsx";

const { Default: StaffNavBar } = composeStories(StaffNavbarStories);
const { Default: StandistsNavBar } = composeStories(StandistsNavbarStories);
const { Default: RallyistsNavBar } = composeStories(RallyistsNavbarStories);

describe("staff navbar", () => {
  const container = render(<StaffNavBar />);

  test("should have 4 elements", async () => {
    const links = container.container.querySelectorAll(".inline-flex");

    expect(links.length).toBe(5);
  });
});

describe("standists navbar", () => {
  const container = render(<StandistsNavBar />);

  test("should have 3 elements", async () => {
    const links = container.container.querySelectorAll(".inline-flex");

    expect(links.length).toBe(3);
  });
});

describe("rallyists navbar", () => {
  beforeAll(() => {
    vi.mock("qr-scanner", () => {
      const QrScanner = vi.fn();
      QrScanner.prototype.start = vi.fn().mockReturnValue(Promise.resolve());
      return { default: QrScanner };
    });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  const container = render(<RallyistsNavBar />);

  test("should have 4 elements", async () => {
    const links = container.container.querySelectorAll(".inline-flex");
    expect(links.length).toBe(4);
  });

  test("should only have 3 links", async () => {
    const links = container.container.querySelectorAll("a");
    expect(links.length).toBe(3);
  });

  test("should have a button", async () => {
    const button = container.container.querySelector("button");
    expect(button).not.toBe(null);
  });

  test("should have a button with the text 'qrcode'", async () => {
    const button = container.container.querySelector("button");
    expect(button?.textContent).toBe("QR Code");
  });

  test("when the button is clicked, it should call the onClick function", async () => {
    const button = container.container.querySelector("button");
    button?.click();

    // try finding an element while the role "dialog" is present
    const dialog = await container.findByRole("dialog");

    expect(dialog).not.toBe(null);
  });
});
