import { useSyncExternalStore } from "react";

/**
 * Hook to detect if the component is running on the client (browser).
 * This is useful for avoiding hydration mismatches in Next.js SSR.
 *
 * It uses useSyncExternalStore to provide a consistent value during hydration
 * and correctly trigger a re-render on the client.
 */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {}, // No need to subscribe to anything
    () => true, // Client snapshot
    () => false // Server snapshot
  );
}
