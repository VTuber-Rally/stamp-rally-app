import { ConvexHttpClient } from "convex/browser";
import type {
  FunctionReference,
  FunctionReturnType,
  FunctionVisibility,
  OptionalRestArgs,
} from "convex/server";

import { scriptEnv } from "./env.js";

declare module "convex/browser" {
  interface ConvexHttpClient {
    // Secret function 🙈
    setAdminAuth(token: string): void;
    function<
      AnyFunction extends FunctionReference<
        "query" | "mutation" | "action",
        FunctionVisibility
      >,
    >(
      anyFunction: AnyFunction | string,
      componentPath?: string,
      ...args: OptionalRestArgs<AnyFunction>
    ): Promise<FunctionReturnType<AnyFunction>>;
  }
}

const client = new ConvexHttpClient(scriptEnv.VITE_CONVEX_URL);

client.setAdminAuth(scriptEnv.CONVEX_ADMIN_KEY);

export { client };
