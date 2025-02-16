import type { Meta, StoryObj } from "@storybook/react";

import Loader from "../components/Loader.tsx";

const meta = {
  title: "Atom/Loader",
  component: Loader,
  argTypes: {
    size: {
      control: {
        type: "range",
        min: 1,
        max: 10,
      },
    },
    className: {
      control: {
        type: "text",
      },
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 4,
  },
};
