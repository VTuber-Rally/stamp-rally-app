import type { Meta, StoryObj } from "@storybook/react";

import ArtistsList from "./ArtistsList";
import { RouterDecorator, TanStackQueryDecorator } from "@/lib/decorators.tsx";
import { EnoughStampsWithId, NotSubmittedStampWithId } from "@/stubs/Stamp.ts";

const meta = {
  title: "Routes/Rallyists/ArtistsList",
  component: ArtistsList,
  decorators: [TanStackQueryDecorator, RouterDecorator],
} satisfies Meta<typeof ArtistsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoStamp: Story = {
  args: {
    stamps: [],
  },
};

export const OneStamp: Story = {
  args: {
    stamps: [NotSubmittedStampWithId],
  },
};

export const CompletedRally: Story = {
  args: {
    stamps: EnoughStampsWithId,
  },
};
