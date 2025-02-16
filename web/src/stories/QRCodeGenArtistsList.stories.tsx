import type { Meta, StoryObj } from "@storybook/react";

import { RouterDecorator, TanStackQueryDecorator } from "@/lib/decorators.tsx";

import QrCodeGenArtistsList from "../components/routes/staff/QRCodeGen/QRCodeGenArtistsList.tsx";

const meta = {
  title: "routes/staff/QRCodeGen/QRCodeGenArtistsList",
  component: QrCodeGenArtistsList,
  decorators: [TanStackQueryDecorator, RouterDecorator],
} satisfies Meta<typeof QrCodeGenArtistsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
