"use client";

import { Clock3, Sparkles } from "lucide-react";

import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiUsage } from "@/features/ai/hooks/use-ai-usage";
import { SettingsContent } from "@/features/settings/components/appearance-settings";
import { normalizeApiError } from "@/lib/api";

export function AiUsageSettings() {
  const usageQuery = useAiUsage();

  return (
    <SettingsContent title="AI Usage" description="Review your current plan and daily AI allowance.">
      <div className="py-6">
        {usageQuery.isLoading && <Skeleton className="h-44 w-full" />}
        {usageQuery.isError && <ErrorState title="Could not load AI usage" description={normalizeApiError(usageQuery.error).message} action={<Button onClick={() => void usageQuery.refetch()}>Try again</Button>} />}
        {usageQuery.data && <UsageCard usage={usageQuery.data} />}
      </div>
    </SettingsContent>
  );
}

function UsageCard({ usage }: { usage: NonNullable<ReturnType<typeof useAiUsage>["data"]> }) {
  const percentage = usage.dailyLimit > 0 ? Math.min(100, Math.round((usage.used / usage.dailyLimit) * 100)) : 0;
  return (
    <section className="rounded-xl border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles className="size-4" /></span><div><h3 className="font-semibold">AI Usage ({usage.plan} Plan)</h3><p className="mt-1 text-sm text-muted-foreground">Daily AI credits for your Notiva account.</p></div></div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-2 text-sm"><p><strong>{usage.used.toLocaleString()}</strong> / {usage.dailyLimit.toLocaleString()} credits used</p><p className="text-muted-foreground">{usage.remaining.toLocaleString()} remaining</p></div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-label="Daily AI usage" aria-valuemin={0} aria-valuemax={usage.dailyLimit} aria-valuenow={usage.used}><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percentage}%` }} /></div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{percentage}% used</span><span className="flex items-center gap-1"><Clock3 className="size-3.5" />Usage date: {usage.usageDate}</span></div>
    </section>
  );
}
