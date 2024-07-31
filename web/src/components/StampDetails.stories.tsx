import type { Meta, StoryObj } from "@storybook/react";

import { StampDetails } from "./StampDetails";
import { NotSubmittedStamp, OtherStamps } from "@/stubs/Stamp.ts";
import { StandistsFromAppwrite } from "@/stubs/Standists.ts";
import { Standist } from "@/lib/models/Standist.ts";

const meta = {
  title: "Rallyist/StampDetails",
  component: StampDetails,
} satisfies Meta<typeof StampDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PaperStamp: Story = {
  args: {
    stamp: NotSubmittedStamp,
    standist: StandistsFromAppwrite.documents[0] as unknown as Standist, // TODO: Fix this
  },
};

export const DigitalStamp: Story = {
  args: {
    stamp: OtherStamps[6],
    standist: StandistsFromAppwrite.documents[11] as unknown as Standist, // TODO: Fix this
  },
};
