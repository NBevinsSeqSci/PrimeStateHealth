import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/events";

type TrackedButtonProps = ComponentProps<typeof Button> & {
  cta: string;
  location: string;
  href?: string;
};

export function TrackedButton({ cta, location, href, onClick, ...props }: TrackedButtonProps) {
  return (
    <Button
      {...props}
      onClick={(event) => {
        track("cta_click", { cta, location, href });
        onClick?.(event);
      }}
    />
  );
}
