import type { Meta, StoryObj } from "@storybook/react";

import { AuthDecorator, TanStackQueryDecorator } from "@/lib/decorators.tsx";
import { LoggedInUserStaff, LoggedInUserStandist } from "@/stubs/User.ts";

import StandistsQRCodeGeneratorPage from "../components/routes/standists/StandistsQRCodeGeneratorPage.tsx";

const meta = {
  title: "Routes/Standists/QRCodeGenerator",
  component: StandistsQRCodeGeneratorPage,
  parameters: {
    auth: {
      user: LoggedInUserStandist,
    },
  },
  decorators: [TanStackQueryDecorator, AuthDecorator],
} satisfies Meta<typeof StandistsQRCodeGeneratorPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const NotStandist: Story = {
  parameters: {
    auth: {
      user: LoggedInUserStaff,
    },
  },
};
