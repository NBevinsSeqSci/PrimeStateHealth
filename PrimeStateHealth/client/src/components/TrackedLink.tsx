import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "wouter";
import { track } from "@/lib/events";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  cta: string;
  location: string;
  children?: ReactNode;
};

export function TrackedLink({ cta, location, href, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      asChild
    >
      <a
        {...props}
        onClick={(event) => {
          track("cta_click", { cta, location, href });
          onClick?.(event);
        }}
      />
    </Link>
  );
}
