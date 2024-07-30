import type { Meta, StoryObj } from "@storybook/react";

import { StandistsNavbar } from "./Navbar";
import { RouterDecorator } from "@/lib/decorators.tsx";

const meta = {
  title: "Components/Navbar/StandistsNavbar",
  component: StandistsNavbar,
  decorators: [RouterDecorator],
} satisfies Meta<typeof StandistsNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
