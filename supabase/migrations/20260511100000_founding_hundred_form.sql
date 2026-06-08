-- Seed: founding-hundred (primary public CTA funnel)

insert into public.forms (slug, name, description, success_title, success_message, notify_email, email_subject)
values (
  'founding-hundred',
  'Founding 100',
  'Primary lead-capture flow for the Founding 100 campaign.',
  'You''re on the list',
  'Thanks for applying to join the Founding 100. We''ll review your details and get back to you within one working day.',
  null,
  'New Founding 100 application'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  success_title = excluded.success_title,
  success_message = excluded.success_message,
  email_subject = excluded.email_subject;

with f as (select id from public.forms where slug = 'founding-hundred')
insert into public.form_questions
  (form_id, sort_order, key, eyebrow, label, hint, type, placeholder, choices, is_optional)
select
  f.id, 10, 'name',
  '1 / First things first',
  'What''s your name?', '',
  'text', 'Type your name here...', '[]'::jsonb, false
from f
union all select f.id, 20, 'email',
  '2 / How do we reach you?',
  'What''s your email?',
  'We''ll use this to follow up about your Founding 100 application.',
  'email', 'name@daycare.com', '[]'::jsonb, false from f
union all select f.id, 30, 'businessName',
  '3 / Tell us about your business',
  'What''s your pet business called?', '',
  'text', 'e.g. Duncan''s Dog Co', '[]'::jsonb, false from f
union all select f.id, 40, 'businessType',
  '4 / What do you run?',
  'What kind of pet business do you run?',
  'Pick the closest fit.',
  'choice', '',
  '["Dog daycare","Dog walking","Boarding","Grooming","Mixed pet care business","Other"]'::jsonb,
  false from f
union all select f.id, 50, 'businessSize',
  '5 / Roughly how busy are you?',
  'How many pets do you handle on a typical day?',
  'Pick the closest range - we won''t hold you to it.',
  'choice', '',
  '["1-10","11-25","26-50","51-100","100+"]'::jsonb,
  false from f
union all select f.id, 60, 'currentSoftware',
  '6 / What are you using today?',
  'What software, if any, are you using right now?',
  'Spreadsheets and paper diaries count.',
  'text', 'e.g. Gingr, spreadsheets, paper, nothing yet...', '[]'::jsonb, true from f
union all select f.id, 70, 'biggestChallenge',
  '7 / Last thing',
  'What would you most like Genera to help with?',
  'A sentence or two is perfect.',
  'textarea', 'e.g. bookings, invoices, routes, customer records...', '[]'::jsonb, false from f
on conflict (form_id, key) do update set
  sort_order = excluded.sort_order,
  eyebrow = excluded.eyebrow,
  label = excluded.label,
  hint = excluded.hint,
  type = excluded.type,
  placeholder = excluded.placeholder,
  choices = excluded.choices,
  is_optional = excluded.is_optional;
