import { useStandists } from "@/lib/hooks/useStandists.ts";

export const useStandist = (standistId?: string) => {
  const { data: standistsList } = useStandists();
  return standistsList.find((standist) => standist.userId === standistId);
};
