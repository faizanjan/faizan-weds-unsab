/**
 * Single source of truth for all invitation content.
 * Keeping copy here keeps components purely presentational.
 */

export interface Person {
  readonly name: string;
  readonly parents: string;
  readonly address: string;
}

export interface FunctionEvent {
  readonly name: string;
  readonly day: string;
  readonly date: string;
  readonly time: string;
}

export interface Contact {
  readonly name: string;
  readonly phone: string;
}

/**
 * A host side (groom or bride). The invitation is one card shared by both
 * families; only the residence, its map, and the RSVP contact differ. The
 * bride's variant is shown when the page is opened with `?B=T`.
 */
export interface Host {
  readonly addressLines: readonly string[];
  readonly mapsEmbedUrl: string;
  readonly mapsLink: string;
  readonly rsvp: Contact;
}

export interface Invitation {
  readonly couple: readonly [string, string];
  readonly conjunction: string;
  readonly tagline: string;
  readonly blessing: string;
  readonly groom: Person;
  readonly bride: Person;
  readonly functions: readonly FunctionEvent[];
  /** Absolute instant the celebrations begin (Mehndi), in Kashmir time (IST). */
  readonly countdownTarget: string;
  readonly hosts: { readonly groom: Host; readonly bride: Host };
  readonly closing: string;
}

export const invitation: Invitation = {
  couple: ["Faizan", "Unsab"],
  conjunction: "&",
  tagline:
    "Of all the lives we could have lived, we chose to spend this one together.",
  blessing:
    "With blessings and joy, we cordially invite you to celebrate the wedding of",
  groom: {
    name: "Faizan Jan",
    parents: "Son of Mrs. & Mr. Ghulam Qadir Jan Rather",
    address: "Nishat Ziethyar, Srinagar",
  },
  bride: {
    name: "Unsab Saahiba Khanum",
    parents: "Daughter of Mrs. & Mr. Javid Ahmad Khan",
    address: "Chanapora, Srinagar",
  },
  functions: [
    {
      name: "Mehndi",
      day: "Saturday",
      date: "26 September 2026",
      time: "7:00 PM onwards",
    },
    {
      name: "Reception",
      day: "Sunday",
      date: "27 September 2026",
      time: "1:00 PM onwards",
    },
  ],
  countdownTarget: "2026-09-26T19:00:00+05:30",
  hosts: {
    groom: {
      addressLines: ["Ziethyar, Nishat", "Srinagar, J&K"],
      mapsEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d648.3379576837558!2d74.88477008173105!3d34.12137781298244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDA3JzE2LjIiTiA3NMKwNTMnMDguNyJF!5e0!3m2!1sen!2sin!4v1783601594708!5m2!1sen!2sin",
      mapsLink: "https://maps.google.com/?q=34.12137781298244,74.88477008173105",
      rsvp: { name: "Jibran Jan", phone: "+91 91031 71780" },
    },
    bride: {
      addressLines: ["Chanapura, Lone Mawla", "Srinagar, J&K"],
      mapsEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d312.0973076152025!2d74.81251561102381!3d34.04119051482368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDAyJzI4LjMiTiA3NMKwNDgnNDYuMSJF!5e0!3m2!1sen!2sin!4v1783703656867!5m2!1sen!2sin",
      mapsLink: "https://maps.google.com/?q=34.04119051482368,74.81251561102381",
      rsvp: { name: "Ghaamiz", phone: "+91 70061 51402" },
    },
  },
  closing: "We look forward to celebrating with you.",
};
