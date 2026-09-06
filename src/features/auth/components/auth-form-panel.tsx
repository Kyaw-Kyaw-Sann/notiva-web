import type { ReactNode } from "react";

type AuthFormPanelProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormPanel({ eyebrow, title, description, children, footer }: AuthFormPanelProps) {
  return (
    <div className="w-full max-w-md">
      {eyebrow && <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
      <div className="mt-8">{children}</div>
      {footer && <div className="mt-7 border-t pt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
