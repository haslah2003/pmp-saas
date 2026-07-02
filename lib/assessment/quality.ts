import { ASFProfile } from "./types";

export function scoreASF(profile: ASFProfile): number {
  let score = 10;

  if (profile.ambiguityLevel >= 3) score += 10;
  if (profile.distractorStrength === "advanced") score += 10;
  if (profile.distractorStrength === "expert") score += 15;
  if (profile.cognitiveLoad >= 8) score += 10;
  if (profile.estimatedPMIDifficulty >= 8.5) score += 10;

  return Math.min(score, 100);
}

export function validateASF(profile: ASFProfile): string[] {
  const errors: string[] = [];

  if (!profile.primaryCompetency)
    errors.push("Missing primary competency.");

  if (!profile.decisionArchitecture)
    errors.push("Missing decision architecture.");

  if (!profile.principleAlignment)
    errors.push("Missing PMBOK principle.");

  if (profile.qualityScore < 80)
    errors.push("Quality score below threshold.");

  return errors;
}