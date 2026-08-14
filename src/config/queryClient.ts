// src/config/queryClient.ts
import { QueryClient, keepPreviousData } from "@tanstack/react-query";

/**
 * Production-grade TanStack Query defaults tuned for an ERP dashboard:
 *
 *  - staleTime: 30s  → a cached dashboard is served instantly on re-mount,
 *                      and background refetches are only fired after it
 *                      goes stale. Kills the refetch storm on navigation.
 *  - gcTime:    15min → keep resolved data around while the user works in
 *                      other modules, so coming back to a dashboard is
 *                      instant and no request is fired (data < staleTime).
 *  - refetchOnMount: true  → remounts only refetch when the cache is stale,
 *                      never when it's still fresh.
 *  - refetchOnWindowFocus: false → dashboards should never surprise-refetch
 *                      when the tab regains focus; live sections opt in via
 *                      per-query `refetchInterval` instead.
 *  - placeholderData: keepPreviousData → when a refetch fires (e.g. an
 *                      interval refresh), the previous data stays on screen
 *                      and no skeleton flashes back in.
 *  - retry: exponential backoff, capped — a slow endpoint degrades quietly
 *                      instead of hammering the API.
 */
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

export const QUERY_DEFAULTS = {
  staleTime: 30 * SECONDS,
  gcTime: 15 * MINUTES,
  retry: 2,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 15_000),
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...QUERY_DEFAULTS,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      placeholderData: keepPreviousData,
    },
    mutations: {
      retry: 0,
    },
  },
});
