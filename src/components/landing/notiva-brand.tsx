import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type NotivaBrandProps = {
  className?: string;
};

export function NotivaBrand({ className }: NotivaBrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md text-xl font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label="Notiva home"
    >
      <Image
        src="/logo3.svg"
        alt=""
        width={40}
        height={40}
        className="size-9 rounded-lg object-cover sm:size-10"
      />
      <span>Notiva</span>
    </Link>
  );
}
