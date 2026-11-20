/**
 * Event subscriptions.
 *
 * Phase 1 (frontend only): there is no backend, so nothing is sent or stored; the request is only validated.
 * Phase 2: replace the body of submitSubscription with an API call (e.g. POST /api/subscriptions) that emails
 * ICF the subscriber's details together with the event link.
 */
export type SubscriptionRequest = {
  name: string;
  email: string;
  mobile: string;
  /** Conference short name and title, e.g. "ICICGB-26: International Conference on …" */
  conference: string;
  /** Full address of the conference's event site, picked up automatically from the page. */
  eventUrl: string;
};

export async function submitSubscription(request: SubscriptionRequest): Promise<{ ok: true; request: SubscriptionRequest }> {
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true, request };
}
