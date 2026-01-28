"use client";

import * as React from "react";
import { ProfileIntakeModal } from "@/components/ProfileIntakeModal";

export function ProfileIntakeTrigger() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button className="ps-btn-secondary" onClick={() => setOpen(true)}>
        Add demographics &amp; history
      </button>
      <ProfileIntakeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
