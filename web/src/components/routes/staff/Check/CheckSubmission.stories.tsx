import type { Meta, StoryObj } from "@storybook/react";

import CheckSubmission from "./CheckSubmission";
import { TanStackQueryDecorator, ToasterDecorator } from "@/lib/decorators.tsx";
import { http, HttpResponse } from "msw";
import {
  NotRedeemedSubmission,
  RedeemedSubmission,
} from "@/stubs/Submission.ts";

const meta = {
  title: "routes/staff/Check/CheckSubmission",
  component: CheckSubmission,
  decorators: [TanStackQueryDecorator, ToasterDecorator],
  args: {
    submissionId: "6693d0c1003554d37b8d",
  },
} satisfies Meta<typeof CheckSubmission>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotRedeemed: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          "https://cloud.appwrite.io/v1/databases/DB_ID/collections/SUBMISSIONS_COLLECTION_ID/documents/6693d0c1003554d37b8d",
          () => HttpResponse.json(NotRedeemedSubmission),
        ),
      ],
    },
  },
};

export const Redeemed: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          "https://cloud.appwrite.io/v1/databases/DB_ID/collections/SUBMISSIONS_COLLECTION_ID/documents/6693d0c1003554d37b8d",
          () => HttpResponse.json(RedeemedSubmission),
        ),
      ],
    },
  },
};
