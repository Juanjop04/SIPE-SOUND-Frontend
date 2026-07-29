import { cn } from "../../lib/utils.js";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("bg-surface rounded-xl p-5 border-l-4 border-l-primary", className)}
      {...props}
    >
      {children}
    </div>
  );
}
