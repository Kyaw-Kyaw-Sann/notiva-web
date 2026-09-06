"use client";

import { useEffect } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type MobileSidebarProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function MobileSidebar({ onOpenChange, open }: MobileSidebarProps) {
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    function closeAtDesktop(event: MediaQueryListEvent) {
      if (event.matches) onOpenChange(false);
    }

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="left-0 top-0 h-dvh w-[min(88vw,20rem)] max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0 [&>button.absolute]:flex [&>button.absolute]:size-10 [&>button.absolute]:items-center [&>button.absolute]:justify-center"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById("mobile-navigation-trigger")?.focus();
        }}
      >
        <DialogTitle className="sr-only">Workspace navigation</DialogTitle>
        <DialogDescription className="sr-only">Navigate your Notiva workspace and manage account display settings.</DialogDescription>
        <AppSidebar
          collapsed={false}
          mobile
          onNavigate={() => onOpenChange(false)}
          onToggleCollapsed={() => undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
