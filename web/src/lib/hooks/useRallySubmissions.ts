import { useQuery } from "convex/react";

import { convexPublicApi } from "@/lib/convex.ts";

export const useRallySubmissions = () =>
  useQuery(convexPublicApi.submissions.getMySubmissions);
