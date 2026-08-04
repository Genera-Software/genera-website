// Tickets logged by an admin through the "+ New ticket" modal on /admin/support
// have no browser session behind them — no account details, no page URL. Rather
// than leaving those cells blank (which reads as a widget submission that lost
// its data), manual tickets record the page as "Admin" and stamp `created_by`
// with the admin who logged them.

export const MANUAL_PAGE_URL = "Admin";

export function isManualPage(pageUrl: string | null): boolean {
  return pageUrl === MANUAL_PAGE_URL;
}
