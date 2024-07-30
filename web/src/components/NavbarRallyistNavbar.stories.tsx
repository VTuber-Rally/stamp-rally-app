import type { Meta, StoryObj } from "@storybook/react";

import { RallyistNavbar } from "./Navbar";
import {
  QRDrawerContextProviderDecorator,
  RouterDecorator,
} from "@/lib/decorators.tsx";

const meta = {
  title: "Components/Navbar/RallyistNavbar",
  component: RallyistNavbar,
  decorators: [RouterDecorator, QRDrawerContextProviderDecorator],
} satisfies Meta<typeof RallyistNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
