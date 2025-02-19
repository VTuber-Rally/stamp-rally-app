import type { Meta, StoryObj } from "@storybook/react";

import {
  AuthDecorator,
  RouterDecorator,
  TanStackQueryDecorator,
} from "@/lib/decorators.tsx";

import SignInForm from "./SignInForm.tsx";

const meta = {
  title: "Common/SignInForm",
  component: SignInForm,
  decorators: [TanStackQueryDecorator, AuthDecorator, RouterDecorator],
} satisfies Meta<typeof SignInForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navigateTo: "/",
  },
};
