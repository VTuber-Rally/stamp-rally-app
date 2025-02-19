import type { Meta, StoryObj } from "@storybook/react";

import {
  QRDrawerContextProviderDecorator,
  RouterDecorator,
} from "@/lib/decorators.tsx";

import { RallyistNavbar } from "./Navbar.tsx";

const meta = {
  title: "Common/Navbar/RallyistNavbar",
  component: RallyistNavbar,
  decorators: [QRDrawerContextProviderDecorator, RouterDecorator],
} satisfies Meta<typeof RallyistNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
