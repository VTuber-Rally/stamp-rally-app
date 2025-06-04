import { Cog, TrashIcon } from "lucide-react";
import { ChangeEvent } from "react";

import { Switch } from "@/components/inputs/Switch.tsx";

type QRCodeSettingsProps = {
  perpetual: boolean;
  onCheckedChange: (value: ((prevState: boolean) => boolean) | boolean) => void;
  expiryDate: Date | null;
  onExpiryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetExpiry: () => void;
};

export function QRCodeSettings({
  perpetual,
  onCheckedChange,
  onExpiryChange,
  expiryDate,
  resetExpiry,
}: QRCodeSettingsProps) {
  return (
    <details className="group border-4 border-dashed border-secondary-light p-2">
      <summary className="flex items-center justify-center gap-1 select-none group-open:pb-2">
        <Cog /> QR Settings
      </summary>
      {perpetual ? "Perpetual QR code" : "One-time QR code"}
      <div className="mt-2 flex items-center space-x-2">
        <Switch
          id="perpetual-qrcode"
          checked={perpetual}
          onCheckedChange={onCheckedChange}
        />
        <label htmlFor="perpetual-qrcode">Perpetual QR code</label>
      </div>

      <div className="mt-2 flex flex-col space-x-2">
        <label htmlFor="expiration-date">Expiration Date</label>
        <div className={"flex gap-2"}>
          <input
            type="datetime-local"
            id="expiration-date"
            name="expiration-date"
            min={new Date().toISOString().slice(0, 16)}
            disabled={perpetual}
            className="rounded border border-secondary-light p-1 invalid:border-red-500 disabled:opacity-40"
            value={expiryDate ? expiryDate.toISOString().slice(0, 16) : ""}
            onChange={onExpiryChange}
          />
          <button
            className="cursor-pointer rounded bg-secondary-light px-2 py-1 text-sm disabled:cursor-auto disabled:opacity-40"
            onClick={() => resetExpiry()}
            disabled={perpetual}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </details>
  );
}
