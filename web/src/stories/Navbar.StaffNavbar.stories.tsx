import type { Meta, StoryObj } from "@storybook/react";

import { RouterDecorator } from "@/lib/decorators.tsx";

import { StaffNavbar } from "../components/Navbar.tsx";

const meta = {
  title: "Common/Navbar/StaffNavbar",
  component: StaffNavbar,
  decorators: [RouterDecorator],
} satisfies Meta<typeof StaffNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
