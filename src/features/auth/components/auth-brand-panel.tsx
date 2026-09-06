import { Check, Sparkles } from "lucide-react";

const benefits = [
  "Keep every idea organized in one focused workspace",
  "Write, refine, and understand notes with thoughtful AI",
  "Stay productive across desktop, tablet, and mobile",
];

export function AuthBrandPanel() {
  return (
    <aside
      className="relative hidden min-h-svh overflow-hidden bg-[#5146e5] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14"
      aria-label="About Notiva"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/10 bg-white/5" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 size-96 rounded-full border border-white/10 bg-[#766df0]/40" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Your ideas, beautifully organized
        </div>

        <h2 className="mt-8 max-w-xl text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
          Make space for your best thinking.
        </h2>
        <p className="mt-5 max-w-lg text-base leading-7 text-indigo-100 xl:text-lg">
          Notiva brings notes, focused writing, and useful AI together in a workspace that stays clear and calm.
        </p>

        <ul className="mt-9 space-y-4" aria-label="Notiva benefits">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex max-w-lg items-start gap-3 text-sm leading-6 text-indigo-50">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-indigo-950/20 backdrop-blur-sm">
        <div className="rounded-xl bg-white p-5 text-slate-900 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-indigo-600">Today&apos;s focus</p>
              <p className="mt-1 font-semibold">Product launch notes</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">Work</span>
          </div>
          <div className="mt-5 space-y-3">
            <div className="h-2.5 w-full rounded-full bg-slate-100" />
            <div className="h-2.5 w-4/5 rounded-full bg-slate-100" />
            <div className="h-2.5 w-3/5 rounded-full bg-indigo-100" />
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="size-3.5 text-indigo-600" aria-hidden="true" />
            AI summary ready when you are
          </div>
        </div>
      </div>
    </aside>
  );
}
