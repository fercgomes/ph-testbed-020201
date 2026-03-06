"use client";

import { usePostHog } from "posthog-js/react";
import { POSTHOG_HOST, POSTHOG_INGEST_HOST, POSTHOG_KEY, posthogConfig } from "@/lib/posthog";

function ConfigRow({ label, value }: { label: string; value: string | boolean | undefined }) {
  return (
    <tr className="border-b border-gray-700">
      <td className="py-2 pr-4 text-gray-400 text-sm font-mono whitespace-nowrap">{label}</td>
      <td className="py-2 text-sm font-mono break-all">
        {value === undefined ? (
          <span className="text-gray-600 italic">undefined</span>
        ) : typeof value === "boolean" ? (
          <span className={value ? "text-green-400" : "text-red-400"}>{String(value)}</span>
        ) : (
          <span className="text-yellow-300">{value}</span>
        )}
      </td>
    </tr>
  );
}

export function PostHogConfig() {
  const posthog = usePostHog();
  const isInitialized = !!posthog?.config;
  const distinctId = posthog?.get_distinct_id?.();
  const sessionId = posthog?.get_session_id?.();
  const featureFlags = posthog?.featureFlags?.getFlags?.() ?? [];

  const keyMasked = POSTHOG_KEY
    ? `${POSTHOG_KEY.slice(0, 6)}...${POSTHOG_KEY.slice(-4)}`
    : "NOT SET";

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div
        className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2 ${
          isInitialized
            ? "bg-green-900/40 text-green-300 border border-green-700"
            : "bg-red-900/40 text-red-300 border border-red-700"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isInitialized ? "bg-green-400" : "bg-red-400"}`} />
        {isInitialized ? "PostHog initialized" : "PostHog NOT initialized — check your API key"}
      </div>

      {/* Env config */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Environment Variables
        </h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full p-4 block">
            <tbody className="block p-3 space-y-0">
              <ConfigRow label="NEXT_PUBLIC_POSTHOG_KEY" value={keyMasked} />
              <ConfigRow label="NEXT_PUBLIC_POSTHOG_HOST" value={POSTHOG_HOST} />
              <ConfigRow label="Ingest (reverse proxy)" value={POSTHOG_INGEST_HOST} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Init config */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Init Config (posthogConfig)
        </h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full p-4 block">
            <tbody className="block p-3 space-y-0">
              {Object.entries(posthogConfig)
                .filter(([, v]) => typeof v !== "function")
                .map(([k, v]) => (
                  <ConfigRow
                    key={k}
                    label={k}
                    value={typeof v === "object" ? JSON.stringify(v) : String(v)}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Runtime state */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Runtime State
        </h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full p-4 block">
            <tbody className="block p-3 space-y-0">
              <ConfigRow label="distinct_id" value={distinctId ?? "—"} />
              <ConfigRow label="session_id" value={sessionId ?? "—"} />
              <ConfigRow label="feature_flags" value={featureFlags.join(", ") || "(none)"} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
