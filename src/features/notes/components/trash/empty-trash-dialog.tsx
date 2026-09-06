"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEmptyTrash } from "@/features/notes/hooks/use-notes";
import { normalizeApiError } from "@/lib/api";

export function EmptyTrashDialog({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emptyTrash = useEmptyTrash();

  async function handleEmptyTrash() {
    setError(null);
    try {
      const deletedCount = await emptyTrash.mutateAsync();
      setOpen(false);
      toast.success(`${deletedCount} ${deletedCount === 1 ? "note" : "notes"} permanently deleted`);
    } catch (requestError) {
      setError(normalizeApiError(requestError).message);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" className="text-destructive hover:text-destructive" disabled={disabled} onClick={() => setOpen(true)}><Trash2 aria-hidden="true" />Empty Recycle Bin</Button>
      <Dialog open={open} onOpenChange={(nextOpen) => { setError(null); setOpen(nextOpen); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Empty Recycle Bin?</DialogTitle>
            <DialogDescription>Every note in your Recycle Bin and its related history will be deleted forever. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" disabled={emptyTrash.isPending} onClick={() => void handleEmptyTrash()}>
              {emptyTrash.isPending && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              Delete everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
