"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * A minimal mutation control (roadmap M7.1). Posts to a same-origin BFF route (never
 * the Nest API directly), then refreshes the server component so the re-read reflects
 * the change. The browser sends `Origin` on this POST, so the BFF CSRF check passes;
 * a hostile cross-origin page cannot forge it.
 */
export function MutationButton({
  action,
  label,
  pendingLabel = "Working…",
  variant = "secondary"
}: {
  action: string;
  label: string;
  pendingLabel?: string;
  variant?: "secondary" | "ghost";
}): React.JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function submit(): Promise<void> {
    setPending(true);
    try {
      await fetch(action, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}"
      });
    } finally {
      setPending(false);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={submit}
      disabled={pending}
      className={`nh-button nh-button--${variant} text-body-sm disabled:opacity-60`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
