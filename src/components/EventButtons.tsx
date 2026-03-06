"use client";

import { usePostHog } from "posthog-js/react";
import { useState } from "react";

const SAMPLE_EVENTS = [
  {
    name: "button_clicked",
    label: "Simple Click",
    props: { button_id: "simple", variant: "primary" },
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "purchase_completed",
    label: "Purchase",
    props: { product_id: "prod_123", price: 49.99, currency: "USD" },
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    name: "error_occurred",
    label: "Trigger Error",
    props: { error_code: "TIMEOUT", severity: "warning", component: "checkout" },
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "feature_used",
    label: "Feature Used",
    props: { feature: "dark_mode", action: "toggled", value: true },
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    name: "search_performed",
    label: "Search",
    props: { query: "nextjs posthog", results_count: 42, took_ms: 120 },
    color: "bg-yellow-600 hover:bg-yellow-700",
  },
  {
    name: "user_signed_up",
    label: "Sign Up",
    props: { plan: "pro", referrer: "google", method: "email" },
    color: "bg-pink-600 hover:bg-pink-700",
  },
];

export function EventButtons() {
  const posthog = usePostHog();
  const [log, setLog] = useState<{ ts: string; event: string; props: object }[]>([]);

  function fire(name: string, props: object) {
    posthog?.capture(name, props);
    setLog((prev) => [{ ts: new Date().toISOString(), event: name, props }, ...prev.slice(0, 19)]);
  }

  function identify() {
    const id = `test-user-${Math.random().toString(36).slice(2, 8)}`;
    posthog?.identify(id, { email: `${id}@example.com`, name: "Test User" });
    setLog((prev) => [
      { ts: new Date().toISOString(), event: "$identify", props: { distinct_id: id } },
      ...prev.slice(0, 19),
    ]);
  }

  function reset() {
    posthog?.reset();
    setLog((prev) => [
      { ts: new Date().toISOString(), event: "$reset", props: {} },
      ...prev.slice(0, 19),
    ]);
  }

  return (
    <div className="space-y-6">
      {/* Event Buttons */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-200">Capture Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SAMPLE_EVENTS.map((e) => (
            <button
              key={e.name}
              onClick={() => fire(e.name, e.props)}
              className={`${e.color} text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer`}
            >
              {e.label}
              <span className="block text-xs font-mono opacity-70 mt-0.5">{e.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Identity Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-200">Identity</h2>
        <div className="flex gap-3">
          <button
            onClick={identify}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            Identify Random User
          </button>
          <button
            onClick={reset}
            className="bg-gray-600 hover:bg-gray-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            Reset Identity
          </button>
        </div>
      </div>

      {/* Event Log */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-200">
          Event Log{" "}
          <span className="text-xs font-normal text-gray-400">(last 20, client-side only)</span>
        </h2>
        {log.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No events fired yet. Click a button above.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {log.map((entry, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3 text-xs font-mono">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400 font-semibold">{entry.event}</span>
                  <span className="text-gray-500 ml-auto">{entry.ts.split("T")[1].split(".")[0]}</span>
                </div>
                <pre className="text-gray-400 whitespace-pre-wrap break-all">
                  {JSON.stringify(entry.props, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
