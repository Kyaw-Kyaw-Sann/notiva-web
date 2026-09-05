import { Skeleton } from "@/components/ui/skeleton";

type LoadingStateProps = { rows?: number };

function LoadingState({ rows = 3 }: LoadingStateProps) { return <div className="space-y-3" aria-label="Loading content" aria-busy="true">{Array.from({ length: rows }, (_, index) => <Skeleton key={index} className="h-16 w-full" />)}</div>; }

export { LoadingState };
