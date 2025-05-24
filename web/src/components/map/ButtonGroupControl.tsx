import { ControlPosition, IControl } from "maplibre-gl";
import { FC, ReactNode, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

import { useMapContext } from "@/contexts/useMapContext.ts";

interface ButtonGroupControlProps {
  placement?: ControlPosition;
  children?: ReactNode;
}

export const ButtonGroupControl: FC<ButtonGroupControlProps> = ({
  placement = "top-left",
  children,
}) => {
  const mapInstance = useMapContext();

  const controlContainer = useMemo<HTMLDivElement>(() => {
    const div = document.createElement("div");
    div.className = "maplibregl-ctrl maplibregl-ctrl-group";
    return div;
  }, []);

  const control = useMemo<IControl>(
    () => ({
      onAdd() {
        return controlContainer;
      },
      onRemove() {},
    }),
    [controlContainer],
  );

  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.addControl(control, placement);
  }, [mapInstance, control, placement]);

  return createPortal(children, controlContainer);
};
