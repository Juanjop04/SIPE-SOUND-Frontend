import { cn } from "../../lib/utils.js";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full bg-ink border border-border rounded-lg px-3 py-2 text-paper text-sm placeholder:text-muted/60 focus:outline-none focus:border-primary transition-colors",
        className
      )}
      {...props}
    />
  );
}
