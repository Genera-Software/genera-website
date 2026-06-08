-- Track read state on form submissions so admins can see new vs read counts.

alter table public.form_submissions
  add column if not exists read_at timestamptz;

create index if not exists form_submissions_unread_idx
  on public.form_submissions (form_id, created_at desc)
  where read_at is null;
