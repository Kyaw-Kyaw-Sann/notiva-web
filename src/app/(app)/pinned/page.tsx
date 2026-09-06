import { redirect } from "next/navigation";

export default function PinnedNotesPage() {
  redirect("/notes?pinned=true");
}
