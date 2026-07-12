"use client";

import type { Host } from "@/data/invitation";
import { useInviteParams } from "@/lib/useInviteParams";

/**
 * Convenience wrapper around {@link useInviteParams} for scenes that only need
 * the active host (groom by default, bride when opened with `?B=T`).
 */
export function useHost(): Host {
  return useInviteParams().host;
}
