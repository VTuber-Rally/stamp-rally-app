import type { Meta, StoryObj } from "@storybook/react";

import { ButtonLink } from "./ButtonLink";
import { RouterDecorator } from "@/lib/decorators.tsx";
import { fn } from "@storybook/test";

const meta = {
  component: ButtonLink,
  decorators: [RouterDecorator],
  argTypes: {
    size: {
      options: ["small", "big"],
      control: { type: "radio" },
    },
    type: {
      options: ["link", "button"],
      control: { type: "radio" },
    },
    bg: {
      options: [undefined, "tertiary", "successOrange"],
      control: { type: "select" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    children: "Button",
    type: "button",
    size: "big",
    onClick: fn(),
    bg: undefined,
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultButton: Story = {} satisfies Story;

export const DefaultLink: Story = {
  args: {
    type: "link",
    href: "/",
  },
} satisfies Story;

export const Small: Story = {
  args: {
    size: "small",
  },
} satisfies Story;

export const Disabled: Story = {
  args: {
    disabled: true,
  },
} satisfies Story;
