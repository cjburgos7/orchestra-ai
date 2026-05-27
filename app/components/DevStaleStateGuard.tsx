"use client";

import { useEffect } from "react";
import { clearStaleDevState } from "@/lib/dev/stale-state";

/** Clears stale localStorage projects once per pipeline version in dev. */
export default function DevStaleStateGuard() {
  useEffect(() => {
    clearStaleDevState();
  }, []);
  return null;
}
