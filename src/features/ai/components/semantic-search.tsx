"use client";

import { ArrowUpRight, LoaderCircle, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSemanticSearch } from "@/features/ai/hooks/use-ai-conversations";
import { normalizeApiError } from "@/lib/api";

export function SemanticSearch() {
  const [question, setQuestion] = useState("");
  const searchNotes = useSemanticSearch();

  function search() {
    const trimmedQuestion = question.trim();
    if (trimmedQuestion) searchNotes.mutate(trimmedQuestion);
  }

  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border bg-surface p-5 shadow-card sm:p-7">
        <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles aria-hidden="true" /></span><div><h2 className="text-lg font-semibold">Ask your notes</h2><p className="mt-1 text-sm text-muted-foreground">Search by meaning to find relevant passages across your active notes.</p></div></div>
        <div className="mt-5 rounded-xl border p-2 focus-within:ring-2 focus-within:ring-ring">
          <Textarea value={question} maxLength={2000} rows={3} placeholder="What did I write about the product launch?" className="resize-none border-0 shadow-none focus-visible:ring-0" onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); search(); } }} aria-label="Question for your notes" />
          <div className="flex justify-end"><Button type="button" disabled={!question.trim() || searchNotes.isPending} onClick={search}>{searchNotes.isPending ? <LoaderCircle className="animate-spin" /> : <Search />}Search notes</Button></div>
        </div>
      </div>

      {searchNotes.isError && <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alert"><p>{normalizeApiError(searchNotes.error).message}</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={search}>Try again</Button></div>}
      {searchNotes.data && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Relevant notes</h3><span className="text-xs text-muted-foreground">{searchNotes.data.resultCount} results</span></div>
          {searchNotes.data.results.length === 0 && <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">No relevant note passages were found. Try asking in a different way.</div>}
          {searchNotes.data.results.map((result) => (
            <article key={result.chunkId} className="rounded-xl border bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between gap-4"><div className="min-w-0"><h4 className="truncate font-medium">{result.noteTitle}</h4><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{result.content}</p></div><Button asChild variant="ghost" size="icon" className="shrink-0"><Link href={`/notes/${result.noteId}`} aria-label={`Open ${result.noteTitle}`}><ArrowUpRight /></Link></Button></div>
              <p className="mt-3 text-xs text-muted-foreground">{Math.round(Math.max(0, Math.min(1, result.similarity)) * 100)}% relevant</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
