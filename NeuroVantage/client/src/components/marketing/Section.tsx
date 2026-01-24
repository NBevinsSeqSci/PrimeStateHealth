import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  title: string;
  subtitle?: ReactNode;
  bullets?: string[];
  cta?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  listClassName?: string;
  bulletClassName?: string;
  titleAs?: ElementType;
};

export function Section({
  title,
  subtitle,
  bullets,
  cta,
  className,
  titleClassName,
  subtitleClassName,
  listClassName,
  bulletClassName,
  titleAs,
}: SectionProps) {
  const TitleTag = titleAs ?? "h3";
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <TitleTag className={cn("text-base font-semibold text-slate-900", titleClassName)}>
          {title}
        </TitleTag>
        {subtitle ? (
          <div className={cn("text-sm text-slate-600", subtitleClassName)}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {bullets && bullets.length > 0 ? (
        <ul className={cn("space-y-2 text-sm text-slate-700", listClassName)}>
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span
                className={cn(
                  "mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-400",
                  bulletClassName
                )}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {cta ? <div>{cta}</div> : null}
    </div>
  );
}
