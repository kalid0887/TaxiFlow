"use client";

import { Card } from "@/components/ui";

export default function ChannelsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">SMS, USSD, and offline drafts</h1>
      <Card className="space-y-3">
        <p>
          These channels are structured, not connected. Nothing is sent to a phone network from this demo.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
          <li>
            SMS notifications: set <code>SMS_PROVIDER_API_KEY</code> and a sender ID with a licensed SMS gateway,
            then map booking status changes to templates.
          </li>
          <li>
            USSD booking: register a short code with a telecom, then implement a session handler that calls the same
            booking rules used in the web search flow.
          </li>
          <li>
            Offline drafts: passengers can already save a search draft in this browser via “Save draft offline” on Find a taxi.
          </li>
        </ul>
      </Card>
    </div>
  );
}
