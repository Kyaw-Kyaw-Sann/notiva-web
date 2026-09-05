import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-lg rounded-xl border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-primary">Notiva</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Frontend foundation is ready.</h1>
        <p className="mt-3 text-muted-foreground">
          The project foundation is set up and ready for the next approved phase.
        </p>
        <Button className="mt-6">Foundation verified</Button>
      </section>
    </main>
  );
}
