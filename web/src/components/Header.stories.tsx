import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./Header";

const meta = {
  title: "Atom/Header",
  component: Header,
  argTypes: {
    children: {
      control: {
        type: "object",
      },
    },
  },
  args: {
    children: "Header",
    className: undefined,
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
