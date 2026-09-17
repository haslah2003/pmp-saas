export type PracticeQuestionType =
  | 'single_response'
  | 'multiple_response'
  | 'pull_down'
  | 'matching'
  | 'ordering';

export type PracticeResponse = string | string[] | Record<string, string>;

type Row = Record<string, unknown>;

function record(value: unknown): Row {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Row) : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function questionType(row: Row): PracticeQuestionType {
  const value = row.question_type;
  return value === 'multiple_response' || value === 'pull_down' || value === 'matching' || value === 'ordering'
    ? value
    : 'single_response';
}

export function scorePracticeResponse(row: Row, response: PracticeResponse) {
  const type = questionType(row);
  const data = record(row.answer_data);

  if (type === 'single_response') {
    return typeof response === 'string' && response === row.correct_answer;
  }

  if (type === 'multiple_response') {
    const selected = strings(response).sort();
    const correct = strings(data.correct).sort();
    return selected.length === correct.length && selected.every((item, index) => item === correct[index]);
  }

  if (type === 'ordering') {
    const selected = strings(response);
    const correct = strings(data.correct_order);
    return selected.length === correct.length && selected.every((item, index) => item === correct[index]);
  }

  if (Array.isArray(response) || typeof response === 'string') return false;

  if (type === 'matching') {
    const correct = record(data.correct);
    const entries = Object.entries(correct);
    return entries.length > 0 && entries.every(([key, value]) => response[key] === value);
  }

  const blanks = Array.isArray(data.blanks) ? data.blanks.map(record) : [];
  return blanks.length > 0 && blanks.every((blank) =>
    typeof blank.id === 'string' && typeof blank.correct === 'string' && response[blank.id] === blank.correct
  );
}

export function publicPracticeQuestion(row: Row, useArabic: boolean) {
  const localized = (arKey: string, enKey: string) => {
    const ar = row[arKey];
    return useArabic && typeof ar === 'string' && ar.trim() ? ar : row[enKey];
  };
  const data = record(useArabic && row.answer_data_ar ? row.answer_data_ar : row.answer_data);
  const type = questionType(row);
  let answerData: Row | null = null;

  if (type === 'multiple_response') answerData = { options: data.options, select_count: data.select_count };
  if (type === 'pull_down') {
    answerData = { blanks: Array.isArray(data.blanks) ? data.blanks.map((value) => {
      const blank = record(value);
      return { id: blank.id, prompt_before: blank.prompt_before, prompt_after: blank.prompt_after, options: blank.options };
    }) : [] };
  }
  if (type === 'matching') answerData = { items: data.items, categories: data.categories };
  if (type === 'ordering') answerData = { items: data.items };

  return {
    id: row.id,
    framework: row.framework,
    domain: row.domain,
    subdomain: row.subdomain,
    difficulty: row.difficulty,
    question_type: type,
    question_text: localized('question_text_ar', 'question_text'),
    option_a: localized('option_a_ar', 'option_a'),
    option_b: localized('option_b_ar', 'option_b'),
    option_c: localized('option_c_ar', 'option_c'),
    option_d: localized('option_d_ar', 'option_d'),
    answer_data: answerData,
  };
}

export function postAnswerFeedback(row: Row, useArabic: boolean) {
  const localized = (arKey: string, enKey: string) => {
    const ar = row[arKey];
    return useArabic && typeof ar === 'string' && ar.trim() ? ar : row[enKey];
  };
  return {
    correctAnswer: row.correct_answer,
    answerData: useArabic && row.answer_data_ar ? row.answer_data_ar : row.answer_data,
    explanation: localized('explanation_ar', 'explanation') || '',
    ritaTip: localized('rita_tip_ar', 'rita_tip') || '',
    pmbokReference: row.pmbok_reference || '',
    ecoReference: row.eco_reference || '',
  };
}
