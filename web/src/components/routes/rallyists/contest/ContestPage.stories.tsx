import type { Meta, StoryObj } from "@storybook/react";

import { RouterDecorator } from "@/lib/decorators";

import { ContestPage } from "./ContestPage";

const meta = {
  title: "Routes/Rallyists/Contest/ContestPage",
  component: ContestPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [RouterDecorator],
} satisfies Meta<typeof ContestPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
