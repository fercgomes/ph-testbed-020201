"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { POSTHOG_KEY, posthogConfig } from "@/lib/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY || POSTHOG_KEY === "phc_your_project_api_key") {
      console.warn(
        "[PostHog] NEXT_PUBLIC_POSTHOG_KEY is not set. Set it in .env.local to enable tracking."
      );
      return;
    }
    posthog.init(POSTHOG_KEY, posthogConfig);
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
