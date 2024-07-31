import type { Meta, StoryObj } from "@storybook/react";

import { StaffNavbar } from "./Navbar";
import { RouterDecorator } from "@/lib/decorators.tsx";

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
