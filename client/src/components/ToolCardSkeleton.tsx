import { Skeleton } from "@/components/ui/skeleton";

export default function ToolCardSkeleton() {
  return <article aria-hidden="true" className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6">
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-violet-300/70 via-cyan-300/60 to-fuchsia-400/70" />
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-4">
        <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
        <Skeleton className="h-8 w-36 bg-white/10" />
      </div>
      <Skeleton className="h-9 w-9 rounded-xl bg-white/10" />
    </div>
    <div className="mt-6 space-y-3">
      <Skeleton className="h-4 w-full bg-white/10" />
      <Skeleton className="h-4 w-5/6 bg-white/10" />
      <Skeleton className="h-4 w-2/3 bg-white/10" />
    </div>
    <div className="mt-6 flex flex-wrap gap-2">
      <Skeleton className="h-7 w-20 rounded-full bg-white/10" />
      <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
      <Skeleton className="h-7 w-16 rounded-full bg-white/10" />
    </div>
    <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-5">
      <Skeleton className="h-4 w-28 bg-white/10" />
      <Skeleton className="h-4 w-20 bg-white/10" />
    </div>
  </article>;
}
