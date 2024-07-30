import type { Meta, StoryObj } from "@storybook/react";

import { StampDetails } from "./StampDetails";
import { NotSubmittedStamp } from "@/stubs/Stamp.ts";
import { StandistsFromAppwrite } from "@/stubs/Standists.ts";
import { Standist } from "@/lib/models/Standist.ts";

const meta = {
  title: "Rallyist/StampDetails",
  component: StampDetails,
  args: {
    stamp: NotSubmittedStamp,
    standist: StandistsFromAppwrite.documents[0] as unknown as Standist, // TODO: Fix this
  },
} satisfies Meta<typeof StampDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
