"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type NotesLayoutPreference = "grid" | "list";
export type EditorWidthPreference = "normal" | "wide";

type SettingsPreferences = {
  notesLayout: NotesLayoutPreference;
  editorWidth: EditorWidthPreference;
};

const storageKey = "notiva.settings.preferences";
const changeEvent = "notiva-settings-preferences-change";
const defaultSnapshot = JSON.stringify({ notesLayout: "grid", editorWidth: "normal" } satisfies SettingsPreferences);

function getSnapshot() { return window.localStorage.getItem(storageKey) ?? defaultSnapshot; }

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(changeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(changeEvent, onStoreChange);
  };
}

function parsePreferences(snapshot: string): SettingsPreferences {
  try {
    const value = JSON.parse(snapshot) as Partial<SettingsPreferences>;
    return {
      notesLayout: value.notesLayout === "list" ? "list" : "grid",
      editorWidth: value.editorWidth === "wide" ? "wide" : "normal",
    };
  } catch {
    return JSON.parse(defaultSnapshot) as SettingsPreferences;
  }
}

function writePreferences(preferences: SettingsPreferences) {
  window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  window.dispatchEvent(new Event(changeEvent));
}

export function useSettingsPreferences() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => defaultSnapshot);
  const preferences = useMemo(() => parsePreferences(snapshot), [snapshot]);
  const setNotesLayout = useCallback((notesLayout: NotesLayoutPreference) => writePreferences({ ...parsePreferences(getSnapshot()), notesLayout }), []);
  const setEditorWidth = useCallback((editorWidth: EditorWidthPreference) => writePreferences({ ...parsePreferences(getSnapshot()), editorWidth }), []);

  return { ...preferences, setNotesLayout, setEditorWidth };
}
