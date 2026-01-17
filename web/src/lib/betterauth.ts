import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { convexSiteURL } from "@/lib/consts.ts";

export const authClient = createAuthClient({
  baseURL: convexSiteURL,
  plugins: [convexClient(), crossDomainClient(), anonymousClient()],
});
