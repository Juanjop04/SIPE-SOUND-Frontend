import { cn } from "@/shared/lib/cn.js";

const variants = {
  primary: "bg-primary hover:bg-primary-hover text-paper",
  success: "bg-success hover:bg-success/90 text-ink",
  ghost: "bg-transparent border border-linea-fuerte text-muted hover:border-primary",
};

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
