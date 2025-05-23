import type { Meta, StoryObj } from "@storybook/react";

import { I18nextDecorator, RouterDecorator } from "@/lib/decorators.tsx";

import StandistStaffHomePage from "./StandistStaffHomePage.tsx";

const meta = {
  title: "Common/StandistStaffHomePage",
  component: StandistStaffHomePage,
  decorators: [RouterDecorator, I18nextDecorator],
} satisfies Meta<typeof StandistStaffHomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headerKey: "Header key",
    loginTo: "/",
    children: "children",
  },
};
