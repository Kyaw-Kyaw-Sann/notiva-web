"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AiUsageSettings } from "@/features/settings/components/ai-usage-settings";
import { AppearanceSettings } from "@/features/settings/components/appearance-settings";
import { EditorSettings } from "@/features/settings/components/editor-settings";
import { NotesViewSettings } from "@/features/settings/components/notes-view-settings";
import { ProfileSettings } from "@/features/settings/components/profile-settings";
import { SecuritySettings } from "@/features/settings/components/security-settings";
import { SettingsSidebar, type SettingsSection } from "@/features/settings/components/settings-sidebar";

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [section, setSection] = useState<SettingsSection>("appearance");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-0 top-0 grid h-dvh w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_1fr] overflow-hidden rounded-none border-0 p-0 md:left-1/2 md:top-1/2 md:h-[min(82vh,48rem)] md:w-[min(calc(100%-3rem),64rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-[15.5rem_minmax(0,1fr)] md:grid-rows-1 md:rounded-2xl md:border [&>button.absolute]:right-4 [&>button.absolute]:top-4 [&>button.absolute]:z-10 [&>button.absolute]:size-9">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Manage your Notiva profile, preferences, usage, and account security.</DialogDescription>
        <aside className="border-b bg-surface-muted/45 md:min-h-0 md:border-b-0 md:border-r">
          <div className="flex h-16 items-center border-b px-5"><p className="text-lg font-semibold">Settings</p></div>
          <SettingsSidebar active={section} onSelect={setSection} />
        </aside>
        <div className="notiva-scrollbar min-h-0 overflow-y-auto px-5 py-7 sm:px-8 md:px-10 md:py-10">
          {section === "profile" && <ProfileSettings />}
          {section === "appearance" && <AppearanceSettings />}
          {section === "editor" && <EditorSettings />}
          {section === "notes-view" && <NotesViewSettings />}
          {section === "ai-usage" && <AiUsageSettings />}
          {section === "security" && <SecuritySettings />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
