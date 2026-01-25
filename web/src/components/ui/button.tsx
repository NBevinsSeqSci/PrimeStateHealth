import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60 " +
  "focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-foreground shadow-sm " +
    "hover:bg-secondary active:bg-secondary " +
    "ring-1 ring-inset ring-primary/40",
  secondary:
    "bg-secondary text-foreground ring-1 ring-inset ring-gray/70 " +
    "hover:bg-secondary/80 active:bg-secondary/70",
  ghost:
    "bg-transparent text-foreground ring-1 ring-inset ring-gray/70 " +
    "hover:bg-secondary/40 active:bg-secondary/60",
  link:
    "bg-transparent text-foreground underline-offset-4 " +
    "hover:underline hover:text-foreground/80",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
