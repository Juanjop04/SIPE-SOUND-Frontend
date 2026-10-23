import { cn } from "@/shared/lib/cn.js";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-linea-fuerte bg-ink px-3 py-2 text-sm text-paper transition-colors placeholder:text-muted/60 focus-visible:border-accent",
        className,
      )}
      {...props}
    />
  );
}
