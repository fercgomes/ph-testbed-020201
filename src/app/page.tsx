import { EventButtons } from "@/components/EventButtons";
import { PostHogConfig } from "@/components/PostHogConfig";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PostHog Testbed</h1>
          <p className="mt-2 text-gray-400">
            Next.js testbed for PostHog. Events are sent through the{" "}
            <code className="bg-gray-800 px-1 rounded text-yellow-300">/ingest</code> reverse proxy
            to avoid ad-blockers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — events */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
            <EventButtons />
          </div>

          {/* Right — config */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-gray-200">Configuration</h2>
            <PostHogConfig />
          </div>
        </div>

        <footer className="text-center text-xs text-gray-600 pt-4">
          Deployed on Vercel · PostHog reverse proxy via{" "}
          <code className="bg-gray-800 px-1 rounded">/ingest</code>
        </footer>
      </div>
    </div>
  );
}
