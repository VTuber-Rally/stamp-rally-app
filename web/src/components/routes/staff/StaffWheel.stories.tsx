import type { Meta, StoryObj } from "@storybook/react";

import StaffWheel from "./StaffWheel";
import { TanStackQueryDecorator } from "@/lib/decorators.tsx";
import { http, HttpResponse } from "msw";
import { WheelEntries } from "@/stubs/WheelEntries.ts";

const meta = {
  title: "Routes/Staff/Wheel",
  component: StaffWheel,
  decorators: [TanStackQueryDecorator],
  parameters: {
    msw: {
      handlers: [
        http.get(
          "https://cloud.appwrite.io/v1/databases/DB_ID/collections/WHEEL_COLLECTION_ID/documents?queries%5B0%5D=%7B%22method%22%3A%22equal%22%2C%22attribute%22%3A%22disabled%22%2C%22values%22%3A%5Bfalse%5D%7D",
          () => HttpResponse.json(WheelEntries),
        ),
      ],
    },
  },
} satisfies Meta<typeof StaffWheel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
