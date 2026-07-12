"use client";

import { useEffect, useState } from "react";
import { invitation, type Host } from "@/data/invitation";

/**
 * The invitation is one card personalised through the query string:
 *   ?B=T   → bride's residence, map, and RSVP contact (else groom's)
 *   ?m=f   → Mehndi is hidden (guest is invited to the Reception only)
 *   ?g=... → guest's name, woven into the hero greeting
 * Params are read only after mount so the static markup never disagrees with
 * the server render.
 */
export interface InviteParams {
  host: Host;
  showMehndi: boolean;
  guestName: string | null;
}

function titleCase(raw: string): string {
  return raw
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const DEFAULTS: InviteParams = {
  host: invitation.hosts.groom,
  showMehndi: true,
  guestName: null,
};

export function useInviteParams(): InviteParams {
  const [params, setParams] = useState<InviteParams>(DEFAULTS);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const isBride = p.get("B") === "T";
    const guest = titleCase((p.get("g") ?? "").trim());

    setParams({
      host: isBride ? invitation.hosts.bride : invitation.hosts.groom,
      showMehndi: p.get("m") !== "f",
      guestName: guest.length ? guest : null,
    });
  }, []);

  return params;
}
