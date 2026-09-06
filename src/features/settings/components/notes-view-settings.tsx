"use client";

import { LayoutGrid, List } from "lucide-react";

import { LocalPreferenceNote, SettingsContent, SettingsRow } from "@/features/settings/components/appearance-settings";
import { SettingsOption } from "@/features/settings/components/settings-option";
import { useSettingsPreferences } from "@/features/settings/hooks/use-settings-preferences";

export function NotesViewSettings() {
  const { notesLayout, setNotesLayout } = useSettingsPreferences();
  return (
    <SettingsContent title="Notes View" description="Choose how notes are displayed on your dashboard.">
      <SettingsRow title="Dashboard layout" description="Switch between a visual card grid and a compact list.">
        <SettingsOption active={notesLayout === "grid"} icon={LayoutGrid} label="Grid" onClick={() => setNotesLayout("grid")} />
        <SettingsOption active={notesLayout === "list"} icon={List} label="List" onClick={() => setNotesLayout("list")} />
      </SettingsRow>
      <LocalPreferenceNote />
    </SettingsContent>
  );
}
