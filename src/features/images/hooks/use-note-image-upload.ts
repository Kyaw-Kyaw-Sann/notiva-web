"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import { uploadNoteImage } from "@/features/images/api/note-images-api";
import type { NoteImageUploadResponse } from "@/features/images/types/note-image.types";
import { AppApiError, normalizeApiError } from "@/lib/api";

const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function useNoteImageUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const failedFileRef = useRef<File | null>(null);
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!supportedImageTypes.has(file.type)) {
        throw new AppApiError("Choose a JPEG, PNG, or WebP image.", { status: 400 });
      }

      try {
        return await uploadNoteImage(file, setProgress);
      } catch (error) {
        throw normalizeApiError(error);
      }
    },
  });

  const upload = useCallback(async (file: File): Promise<NoteImageUploadResponse> => {
    failedFileRef.current = null;
    setProgress(0);

    try {
      return await mutation.mutateAsync(file);
    } catch (error) {
      failedFileRef.current = file;
      throw error;
    } finally {
      setProgress(null);
    }
  }, [mutation]);

  const retry = useCallback(async () => {
    if (!failedFileRef.current) return null;
    return upload(failedFileRef.current);
  }, [upload]);

  return {
    error: mutation.error ? normalizeApiError(mutation.error) : null,
    isUploading: mutation.isPending,
    progress,
    retry,
    upload,
  };
}
