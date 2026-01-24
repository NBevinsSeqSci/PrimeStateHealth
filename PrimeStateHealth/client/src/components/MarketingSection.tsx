import type { ElementType, ReactNode } from "react";
import { Link } from "wouter";
import { Button, type ButtonProps } from "@/components/ui/button";
import { TrackedLink } from "@/components/TrackedLink";

type MarketingSectionCTA = {
  label: string;
  href: string;
  variant?: ButtonProps["variant"];
  tracking?: {
    cta: string;
    location: string;
  };
};

type MarketingSectionProps = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  cta?: MarketingSectionCTA;
  titleAs?: ElementType;
  titleClassName?: string;
  bulletClassName?: string;
  subtitleClassName?: string;
  listClassName?: string;
  children?: ReactNode;
};

export function MarketingSection({
  title,
  subtitle,
  bullets = [],
  cta,
  titleAs: TitleTag = "h2",
  titleClassName = "text-xl font-semibold text-slate-900",
  bulletClassName = "bg-primary",
  subtitleClassName = "text-muted-foreground",
  listClassName = "text-sm text-slate-600",
  children,
}: MarketingSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <TitleTag className={titleClassName}>{title}</TitleTag>
        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      </div>
      {bullets.length > 0 && (
        <ul className={`space-y-2 ${listClassName}`}>
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className={`mt-2 h-1.5 w-1.5 rounded-full ${bulletClassName}`} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {children}
      {cta && (
        <div>
          {cta.tracking ? (
            <TrackedLink href={cta.href} cta={cta.tracking.cta} location={cta.tracking.location}>
              <Button variant={cta.variant ?? "default"}>{cta.label}</Button>
            </TrackedLink>
          ) : (
            <Link href={cta.href}>
              <Button variant={cta.variant ?? "default"}>{cta.label}</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
