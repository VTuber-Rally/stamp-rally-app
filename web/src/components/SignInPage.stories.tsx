import type { Meta, StoryObj } from "@storybook/react";

import {
  AuthDecorator,
  RouterDecorator,
  TanStackQueryDecorator,
} from "@/lib/decorators.tsx";

import SignInPage from "./SignInPage";

const meta = {
  title: "Common/SignInPage",
  component: SignInPage,
  decorators: [TanStackQueryDecorator, AuthDecorator, RouterDecorator],
} satisfies Meta<typeof SignInPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navigateTo: "/",
  },
};
