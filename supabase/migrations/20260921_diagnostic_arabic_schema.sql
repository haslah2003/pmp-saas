-- Arabic localization fields are stored alongside the source English item so
-- answer keys, psychometric metadata, and exposure controls remain shared.
alter table public.diagnostic_items
  add column if not exists stem_ar text,
  add column if not exists options_ar jsonb,
  add column if not exists rationale_correct_ar text,
  add column if not exists rationale_distractors_ar jsonb,
  add column if not exists visual_spec_ar jsonb;

alter table public.diagnostic_items
  drop constraint if exists diagnostic_items_options_ar_shape,
  add constraint diagnostic_items_options_ar_shape check (
    options_ar is null or (
      jsonb_typeof(options_ar) = 'array'
      and jsonb_array_length(options_ar) = jsonb_array_length(options)
    )
  );

comment on column public.diagnostic_items.stem_ar is 'Professionally localized Arabic stem; NULL means the Arabic item must not be served.';
comment on column public.diagnostic_items.options_ar is 'Arabic option text using the same stable option IDs and answer key as English.';
comment on column public.diagnostic_items.rationale_correct_ar is 'Arabic explanation of the keyed response for controlled feedback.';
comment on column public.diagnostic_items.rationale_distractors_ar is 'Arabic misconception feedback keyed by the same distractor IDs as English.';

notify pgrst, 'reload schema';
