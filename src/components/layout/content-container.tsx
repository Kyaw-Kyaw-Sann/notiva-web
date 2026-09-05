import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ContentWidth = "normal" | "narrow" | "editor" | "wide-editor";
type ContentContainerProps = ComponentProps<"div"> & { width?: ContentWidth };
const widths: Record<ContentWidth, string> = { normal: "max-w-5xl", narrow: "max-w-2xl", editor: "max-w-3xl", "wide-editor": "max-w-6xl" };

function ContentContainer({ className, width = "normal", ...props }: ContentContainerProps) { return <div className={cn("w-full", widths[width], className)} {...props} />; }

export { ContentContainer, type ContentWidth };
