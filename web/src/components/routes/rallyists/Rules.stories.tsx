import type { Meta, StoryObj } from "@storybook/react";

import Rules from "./Rules.tsx";
import { RouterDecorator } from "@/lib/decorators.tsx";

const meta = {
  title: "Routes/Rallyists/Rules",
  component: Rules,
  decorators: [RouterDecorator],
} satisfies Meta<typeof Rules>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
