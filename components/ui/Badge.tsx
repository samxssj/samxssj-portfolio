export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border-soft bg-surface px-3 py-1 text-xs font-semibold text-muted">
      {children}
    </span>
  );
}
