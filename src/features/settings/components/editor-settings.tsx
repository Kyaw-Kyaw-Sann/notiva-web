"use client";

import { PanelTop, StretchHorizontal } from "lucide-react";

import { LocalPreferenceNote, SettingsContent, SettingsRow } from "@/features/settings/components/appearance-settings";
import { SettingsOption } from "@/features/settings/components/settings-option";
import { useSettingsPreferences } from "@/features/settings/hooks/use-settings-preferences";

export function EditorSettings() {
  const { editorWidth, setEditorWidth } = useSettingsPreferences();
  return (
    <SettingsContent title="Editor" description="Adjust your writing workspace on this device.">
      <SettingsRow title="Editor width" description="Use a focused normal width or a wider writing area.">
        <SettingsOption active={editorWidth === "normal"} icon={PanelTop} label="Normal" onClick={() => setEditorWidth("normal")} />
        <SettingsOption active={editorWidth === "wide"} icon={StretchHorizontal} label="Wide" onClick={() => setEditorWidth("wide")} />
      </SettingsRow>
      <LocalPreferenceNote />
    </SettingsContent>
  );
}
