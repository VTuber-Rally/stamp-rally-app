import type { Meta, StoryObj } from "@storybook/react";

import HomepageLaunchpad from "@/components/HomepageLaunchpad.tsx";
import {
  QRDrawerContextProviderDecorator,
  RouterDecorator,
} from "@/lib/decorators.tsx";

const meta = {
  title: "Rallyist/HomePage/Launchpad",
  component: HomepageLaunchpad,
  decorators: [QRDrawerContextProviderDecorator, RouterDecorator],
} satisfies Meta<typeof HomepageLaunchpad>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
