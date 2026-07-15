-- Widen the questions.question_type CHECK constraint to allow the new
-- ECO 2026 interactive item types: matching (drag-and-drop) and ordering (sequencing).
-- Safe: all existing rows are single_response / multiple_response / pull_down.

ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_question_type_check;

ALTER TABLE public.questions
  ADD CONSTRAINT questions_question_type_check
  CHECK (question_type IN ('single_response', 'multiple_response', 'pull_down', 'matching', 'ordering'));
