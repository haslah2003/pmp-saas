-- Remove transparent absolute-qualifier cues from the review bank. These
-- substitutions retain the distractor's underlying misconception while
-- avoiding a giveaway extreme.

update public.diagnostic_items set options =
  replace(replace(replace(replace(replace(replace(replace(replace(
    options::text,
    ' every ', ' each relevant '),
    ' Every ', ' Each relevant '),
    ' all ', ' the relevant '),
    ' All ', ' The relevant '),
    ' always ', ' generally '),
    ' immediately ', ' before completing impact analysis '),
    ' indefinitely ', ' for an open-ended period '),
    ' entirely ', ' largely ')::jsonb
where track_id = 'pmbok8';

notify pgrst, 'reload schema';
