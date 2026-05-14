import { ReactMutation } from "convex/react";
import type { FunctionReference, OptionalRestArgs } from "convex/server";
import { useState } from "react";
import { api } from "~/_generated/api";
import type { DataModel as ConvexDataModel, Id } from "~/_generated/dataModel";

export type User = ConvexDataModel["users"]["document"];
export type Booth = ConvexDataModel["booths"]["document"];
export type PublicBooth = (typeof api.booths.listBooths._returnType)[number];
export type Submission = ConvexDataModel["submissions"]["document"];
export type Prize = ConvexDataModel["prizes"]["document"];
export type { Id as ConvexId };
export { api as convexPublicApi };

export { type ConvexDataModel };

export const useDLEMutation = <Mutation extends FunctionReference<"mutation">>(
  mutateFn: ReactMutation<Mutation>,
): {
  isLoading: boolean;
  error: Error | null;
  mutate: ReactMutation<Mutation>;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mutate = ((...args: OptionalRestArgs<Mutation>) => {
    setIsLoading(true);
    return mutateFn(...args)
      .then(
        (r) => {
          setError(null);
          return r;
        },
        (e) => {
          setError(e as Error);
          throw e;
        },
      )
      .finally(() => {
        setIsLoading(false);
      });
  }) as ReactMutation<Mutation>;
  return { isLoading, error, mutate };
};
