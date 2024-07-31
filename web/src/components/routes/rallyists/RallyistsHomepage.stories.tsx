import type { Meta, StoryObj } from "@storybook/react";

import RallyistsHomepage from "./RallyistsHomepage";
import {
  QRDrawerContextProviderDecorator,
  RouterDecorator,
  TanStackQueryDecorator,
} from "@/lib/decorators.tsx";
import { EnoughStampsWithId, NotSubmittedStampWithId } from "@/stubs/Stamp.ts";

const meta = {
  title: "Routes/Rallyists/Homepage",
  component: RallyistsHomepage,
  decorators: [
    TanStackQueryDecorator,
    RouterDecorator,
    QRDrawerContextProviderDecorator,
  ],
} satisfies Meta<typeof RallyistsHomepage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoStamp: Story = {};

export const OneStamp: Story = {
  args: {
    stamps: [NotSubmittedStampWithId],
  },
};

export const WithRallyCompleted: Story = {
  args: {
    stamps: EnoughStampsWithId,
  },
};
