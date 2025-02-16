import type { Meta, StoryObj } from "@storybook/react";

import { RouterDecorator } from "@/lib/decorators.tsx";

import { StandistsNavbar } from "../components/Navbar.tsx";

const meta = {
  title: "Common/Navbar/StandistsNavbar",
  component: StandistsNavbar,
  decorators: [RouterDecorator],
} satisfies Meta<typeof StandistsNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
