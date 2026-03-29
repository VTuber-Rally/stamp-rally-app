import { ReactMutation, useMutation } from "convex/react";
import type { FunctionReference, OptionalRestArgs } from "convex/server";
import { useState } from "react";
import type { DataModel as ConvexDataModel } from "~/_generated/dataModel";

export { api as convexPublicApi } from "~/_generated/api";

export type User = ConvexDataModel["users"]["document"];

export { type ConvexDataModel };

type Mutation = Parameters<typeof useMutation>[0];

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
