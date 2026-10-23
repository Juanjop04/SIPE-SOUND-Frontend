import { cn } from "../../lib/utils.js";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("rounded-xl border-l-4 border-l-primary bg-surface p-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
