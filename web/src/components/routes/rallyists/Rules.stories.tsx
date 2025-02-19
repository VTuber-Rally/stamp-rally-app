import type { Meta, StoryObj } from "@storybook/react";

import { RouterDecorator } from "@/lib/decorators.tsx";

import Rules from "./Rules.tsx";

const meta = {
  title: "Routes/Rallyists/Rules",
  component: Rules,
  decorators: [RouterDecorator],
} satisfies Meta<typeof Rules>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
