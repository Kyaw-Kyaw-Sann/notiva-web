export default function ProtectedPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl items-center justify-center">
      <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-card sm:p-10">
        <p className="text-sm font-medium text-primary">Notiva workspace</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">Your workspace shell is ready.</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          Notes, categories, and workspace tools will be added in their planned phases.
        </p>
      </div>
    </section>
  );
}
