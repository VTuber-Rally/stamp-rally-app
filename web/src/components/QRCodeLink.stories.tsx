import type { Meta, StoryObj } from "@storybook/react";

import QrCodeLink from "./QRCodeLink";
import { QRDrawerContextProviderDecorator } from "@/lib/decorators.tsx";

const meta = {
  title: "Rallyist/QRCodeLink",
  component: QrCodeLink,
  decorators: [QRDrawerContextProviderDecorator],
} satisfies Meta<typeof QrCodeLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
