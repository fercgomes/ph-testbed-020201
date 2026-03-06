import type { PostHogConfig } from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

// Use the Next.js reverse proxy so events don't get blocked by ad-blockers
export const POSTHOG_INGEST_HOST = "/ingest";

export const posthogConfig: Partial<PostHogConfig> = {
  api_host: POSTHOG_INGEST_HOST,
  ui_host: POSTHOG_HOST,
  capture_pageview: "history_change",
  capture_pageleave: true,
  cross_subdomain_cookie: false,
  persistence: "localStorage+cookie",
  autocapture: true,
  session_recording: {
    maskAllInputs: false,
  },
  loaded: (posthog) => {
    if (process.env.NODE_ENV === "development") {
      posthog.debug();
    }
  },
};
