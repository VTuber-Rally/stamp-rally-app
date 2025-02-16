import type { Meta, StoryObj } from "@storybook/react";
import { HttpResponse, http } from "msw";

import {
  AuthDecorator,
  TanStackQueryDecorator,
  ToasterDecorator,
} from "@/lib/decorators.tsx";
import { handlers } from "@/msw.ts";
import { LoggedInUserStaff, LoggedInUserStandist } from "@/stubs/User.ts";

import StandistsProfilePage from "../components/routes/standists/StandistsProfilePage.tsx";

const meta = {
  title: "Routes/Standists/Profile",
  component: StandistsProfilePage,
  parameters: {
    auth: {
      user: LoggedInUserStandist,
    },
    msw: {
      handlers: [
        ...handlers,
        http.patch(
          "https://cloud.appwrite.io/v1/databases/DB_ID/collections/STANDISTS_COLLECTION_ID/documents/66873ba600197035870f",
          () => HttpResponse.json({}),
        ),
      ],
    },
  },
  decorators: [TanStackQueryDecorator, AuthDecorator, ToasterDecorator],
} satisfies Meta<typeof StandistsProfilePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotStandist: Story = {
  parameters: {
    auth: {
      user: LoggedInUserStaff,
    },
  },
};

export const NotLoggedIn: Story = {
  parameters: {
    auth: {
      user: null,
    },
  },
};
