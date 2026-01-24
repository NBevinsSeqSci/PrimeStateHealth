import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type CTAProps = ButtonProps;

const InlineCTALink = React.forwardRef<HTMLButtonElement, CTAProps>(
  ({ variant = "link", size = "sm", ...props }, ref) => {
    return <Button ref={ref} variant={variant} size={size} {...props} />;
  }
);
InlineCTALink.displayName = "InlineCTALink";

const PrimaryCTAButton = React.forwardRef<HTMLButtonElement, CTAProps>(
  ({ variant = "default", size = "lg", ...props }, ref) => {
    return <Button ref={ref} variant={variant} size={size} {...props} />;
  }
);
PrimaryCTAButton.displayName = "PrimaryCTAButton";

export { InlineCTALink, PrimaryCTAButton };
