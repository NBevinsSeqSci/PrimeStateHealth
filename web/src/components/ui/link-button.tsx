import Link from "next/link";
import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-white select-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white shadow-sm " +
    "hover:bg-slate-800 active:bg-slate-700 " +
    "focus-visible:ring-slate-400",
  secondary:
    "bg-secondary text-foreground ring-1 ring-inset ring-gray/70 " +
    "hover:bg-secondary/80 active:bg-secondary/70",
  ghost:
    "bg-white text-slate-900 border border-slate-300 shadow-sm " +
    "hover:bg-slate-50 active:bg-slate-100 " +
    "focus-visible:ring-slate-400",
  link:
    "bg-transparent text-foreground underline-offset-4 " +
    "hover:underline hover:text-foreground/80",
};

export function LinkButton({
  href,
  children,
  className,
  variant = "secondary",
  size = "md",
  ...props
}: React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <Link
      href={href}
      className={cx(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
