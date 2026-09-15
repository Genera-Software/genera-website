-- The docs "Get support" form can now carry a request to join the mobile app
-- betas (TestFlight on iPhone, Google Play closed testing on Android).
alter table public.support_tickets
  drop constraint if exists support_tickets_category_check;
alter table public.support_tickets
  add constraint support_tickets_category_check
  check (category in ('technical', 'billing', 'feature_request', 'account', 'other', 'app_testing'));
