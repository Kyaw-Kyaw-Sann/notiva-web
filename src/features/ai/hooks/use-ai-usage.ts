"use client";

import { useQuery } from "@tanstack/react-query";

import { getAiUsage } from "@/features/ai/api/ai-writing-api";

export function useAiUsage(enabled = true) {
  return useQuery({ queryKey: ["ai", "usage"], queryFn: getAiUsage, enabled });
}
