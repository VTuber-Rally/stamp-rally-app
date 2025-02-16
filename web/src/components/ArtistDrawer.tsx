import type { Dispatch, FC, SetStateAction } from "react";

import { ArtistPresentation } from "@/components/ArtistPresentation.tsx";
import { Drawer, DrawerContent } from "@/components/Drawer.tsx";

export const ArtistDrawer: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeStandistId: string | null;
}> = ({ open, setOpen, activeStandistId }) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        {activeStandistId && <ArtistPresentation artistId={activeStandistId} />}
      </DrawerContent>
    </Drawer>
  );
};
