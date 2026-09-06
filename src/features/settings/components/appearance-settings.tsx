"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { SettingsOption } from "@/features/settings/components/settings-option";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsContent title="Appearance" description="Customize how Notiva looks on this device.">
      <SettingsRow title="Theme" description="Choose light, dark, or follow your system setting.">
        <SettingsOption active={theme === "light"} icon={Sun} label="Light" onClick={() => setTheme("light")} />
        <SettingsOption active={theme === "dark"} icon={Moon} label="Dark" onClick={() => setTheme("dark")} />
        <SettingsOption active={theme === "system"} icon={Laptop} label="System" onClick={() => setTheme("system")} />
      </SettingsRow>
      <LocalPreferenceNote />
    </SettingsContent>
  );
}

export function SettingsContent({ children, description, title }: { children: React.ReactNode; description: string; title: string }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-6 border-t">{children}</div>
    </div>
  );
}

export function SettingsRow({ children, description, title }: { children: React.ReactNode; description: string; title: string }) {
  return (
    <section className="grid gap-4 border-b py-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,1.25fr)] lg:items-center">
      <div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div>
      <div className="flex gap-2">{children}</div>
    </section>
  );
}

export function LocalPreferenceNote() {
  return <p className="pt-5 text-xs text-muted-foreground">This preference is stored only on this device and is not synced to your account.</p>;
}
