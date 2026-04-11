import { ArrowUpRightFromSquare } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Switch } from "@/components/inputs/Switch.tsx";
import { Header } from "@/components/layout/Header.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/layout/Table";
import { QRCodeSettings } from "@/components/routes/staff/QRCodeGen/QRCodeSettings.tsx";
import { PublicBooth } from "@/lib/convex.ts";
import { useBooths } from "@/lib/hooks/useBooths.ts";
import { useStaffQRCode } from "@/lib/hooks/useStaffQRCode.ts";

function StampLinksArtistsList() {
  const { data: booths } = useBooths();

  const [perpetual, setPerpetual] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  return (
    <div className={"mb-4"}>
      <Header>Liens des stamps par artiste</Header>
      <QRCodeSettings
        perpetual={perpetual}
        onCheckedChange={setPerpetual}
        expiryDate={expiryDate}
        onExpiryChange={(e) =>
          setExpiryDate(e.target.value ? new Date(e.target.value) : null)
        }
        resetExpiry={() => setExpiryDate(null)}
      />
      <div className="mt-2 flex items-center justify-center space-x-2">
        <Switch id="show-qr" checked={showQR} onCheckedChange={setShowQR} />
        <label htmlFor="show-qr">Show QR codes</label>
      </div>
      {booths && (
        <Table className={"gap-4 overflow-x-scroll"}>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Lien</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {booths.map((booth) => (
              <StampLinksArtistRow
                key={booth._id}
                booth={booth}
                expiry={expiryDate}
                showQR={showQR}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

const StampLinksArtistRow = ({
  booth,
  expiry,
  showQR,
}: {
  booth: PublicBooth;
  expiry: Date | null;
  showQR: boolean;
}) => {
  const { data: qrValue } = useStaffQRCode(booth.userId, false, expiry);

  if (!qrValue?.codeData) {
    return (
      <TableRow key={booth.userId}>
        <TableCell>
          <p>{booth.name}</p>
        </TableCell>
        <TableCell>
          <div className="mt-2 h-12 w-48 animate-pulse rounded-2xl bg-primary/50"></div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={booth.userId}>
      <TableCell>
        <p>{booth.name}</p>
      </TableCell>
      <TableCell>
        {showQR ? (
          <>
            <p className={"text-center text-lg font-bold"}>{booth.name}</p>
            <QRCode
              className="rounded-lg border-4 border-tertiary p-2 dark:bg-white"
              value={qrValue.codeData}
            />
            <p className={"text-center font-semibold"}>
              {expiry?.toLocaleDateString("en-GB", {
                dateStyle: "medium",
              })}
            </p>
          </>
        ) : (
          <ButtonLink
            target={"_blank"}
            href={qrValue.codeData}
            size={"small"}
            className="h-12"
          >
            <span className="w-37">Lien du stamp</span>{" "}
            <ArrowUpRightFromSquare size={20} className="ml-2" />
          </ButtonLink>
        )}
      </TableCell>
    </TableRow>
  );
};

export default StampLinksArtistsList;
