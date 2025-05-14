// components/ui/badge.tsx
import { cn } from "~/lib/utils";

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "green" | "red" | "yellow";
  className?: string;
}) {
  const variantClass = {
    default: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClass,
        className
      )}
    >
      {children}
    </span>
  );
}
