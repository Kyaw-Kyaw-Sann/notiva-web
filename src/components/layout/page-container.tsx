import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = ComponentProps<"div"> & { fullWidth?: boolean };

function PageContainer({ className, fullWidth = false, ...props }: PageContainerProps) {
  return <div className={cn("w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8", !fullWidth && "mx-auto max-w-7xl", className)} {...props} />;
}

export { PageContainer };
