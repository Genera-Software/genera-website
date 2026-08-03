/**
 * Short human-readable reference for a ticket, e.g. #3F2A9C01. Stable because
 * it's derived from the UUID. Kept out of thread.ts so client components can
 * use it (thread.ts is server-only).
 */
export function ticketRef(ticketId: string): string {
  return ticketId.replace(/-/g, "").slice(0, 8).toUpperCase();
}
