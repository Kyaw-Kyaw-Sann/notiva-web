import { redirect } from "next/navigation";

export default function FavoriteNotesPage() {
  redirect("/notes?favorite=true");
}
