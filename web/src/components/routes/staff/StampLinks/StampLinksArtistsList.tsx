import { ArrowUpRightFromSquare } from "lucide-react";

import { Standist } from "@vtuber-stamp-rally/shared-lib/models/Standist.ts";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Header } from "@/components/layout/Header.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/layout/Table";
import { useStaffQRCode } from "@/lib/hooks/useStaffQRCode.ts";
import { useStandists } from "@/lib/hooks/useStandists.ts";

function StampLinksArtistsList() {
  const { data: standistsList } = useStandists();

  return (
    <div className={"mb-4"}>
      <Header>Liens des stamps par artiste</Header>
      {standistsList && (
        <Table className={"gap-4 overflow-x-scroll"}>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Lien</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standistsList.map((doc) => (
              <StampLinksArtistRow key={doc.userId} doc={doc} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

const StampLinksArtistRow = ({ doc }: { doc: Standist }) => {
  const { data: qrValue } = useStaffQRCode(doc.userId, false);

  return (
    <TableRow key={doc.userId}>
      <TableCell>
        <p>{doc.name}</p>
      </TableCell>
      <TableCell>
        {qrValue?.codeData ? (
          <ButtonLink
            target={"_blank"}
            href={qrValue.codeData}
            size={"small"}
            className="h-12"
          >
            <span className="w-37">Lien du stamp</span>{" "}
            <ArrowUpRightFromSquare size={20} className="ml-2" />
          </ButtonLink>
        ) : (
          <div className="mt-2 h-12 w-48 animate-pulse rounded-2xl bg-primary/50"></div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default StampLinksArtistsList;
