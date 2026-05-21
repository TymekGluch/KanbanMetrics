import React from "react";
import { createPortal } from "react-dom";

export function useDropdownPortal(open: boolean) {
  const [portalElement, setPortalElement] = React.useState<HTMLElement | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      let portal = document.getElementById("select-dropdown-portal");
      if (!portal) {
        portal = document.createElement("div");
        portal.id = "select-dropdown-portal";
        document.body.appendChild(portal);
      }
      setPortalElement(portal);
    }
  }, [open]);

  return { portalElement, dropdownRef };
}

interface DropdownPortalProps extends React.PropsWithChildren {
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
}

export function DropdownPortal(props: DropdownPortalProps) {
  const { open, children, anchorRef } = props;

  const { portalElement, dropdownRef } = useDropdownPortal(open);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const updatePosition = React.useCallback(() => {
    if (open && anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      setStyle({
        position: "absolute",
        top: anchorRect.bottom + window.scrollY,
        left: anchorRect.left + window.scrollX,
        width: anchorRect.width,
        minWidth: anchorRect.width,
        zIndex: 1300,
      });
    }
  }, [open, anchorRef]);

  React.useEffect(() => {
    updatePosition();
    if (!open) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  if (!open || !portalElement) {
    return null;
  }

  return createPortal(
    <div ref={dropdownRef} style={style}>
      {children}
    </div>,
    portalElement
  );
}
