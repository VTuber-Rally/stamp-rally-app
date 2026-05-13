import { KEY_VALUES } from "@/lib/KeyValues.ts";
import { encodeContestSecretToQRCode } from "@/lib/StampQRCodes";
import { useKeyValue } from "@/lib/hooks/useKeyValue.ts";

export function useContestQRCode() {
  const secret = useKeyValue(KEY_VALUES.contestRegistrationSecret);

  const isLoading = secret === undefined;
  const data = secret ? encodeContestSecretToQRCode(secret) : undefined;

  return { data, isLoading };
}
