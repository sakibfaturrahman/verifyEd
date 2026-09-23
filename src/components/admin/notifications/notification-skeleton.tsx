export function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4 animate-pulse"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-800 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/4" />
            <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded-md w-3/4" />
            <div className="h-2.5 bg-slate-200 dark:bg-zinc-800 rounded-md w-24 pt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
