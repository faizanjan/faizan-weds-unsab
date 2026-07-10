"use client";

import { useEffect, useState } from "react";
import { invitation, type Host } from "@/data/invitation";

/**
 * The invitation is one card shared by both families. Opening it with `?B=T`
 * (B = bride, T = true) swaps in the bride's residence, map, and RSVP contact.
 * The param is read only after mount so the static markup never disagrees with
 * the server render.
 */
export function useHost(): Host {
  const [isBride, setIsBride] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsBride(params.get("B") === "T");
  }, []);

  return isBride ? invitation.hosts.bride : invitation.hosts.groom;
}
