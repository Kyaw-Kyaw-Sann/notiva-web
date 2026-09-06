import type { NoteImageUploadResponse } from "@/features/images/types/note-image.types";
import { post, remove } from "@/lib/api";

export function uploadNoteImage(file: File, onProgress: (percentage: number | null) => void) {
  const formData = new FormData();
  formData.append("file", file);

  return post<NoteImageUploadResponse, FormData>("/api/images/notes", formData, {
    onUploadProgress: (event) => {
      if (!event.total) {
        onProgress(null);
        return;
      }

      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    },
  });
}

export function deleteNoteImage(publicId: string) {
  return remove<null, { publicId: string }>("/api/images/notes", { publicId });
}
