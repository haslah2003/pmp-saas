export const ASF_VERSION = "1.0.0";

export type AmbiguityLevel = 1 | 2 | 3 | 4;

export type DistractorStrength =
  | "basic"
  | "moderate"
  | "advanced"
  | "expert";

export type DecisionHorizon =
  | "immediate"
  | "short_term"
  | "medium_term"
  | "long_term"
  | "enterprise";

export interface ASFProfile {
  version: string;

  blueprintId: string;

  primaryCompetency: string;
  secondaryCompetency: string;

  decisionArchitecture: string;

  ambiguityLevel: AmbiguityLevel;

  distractorStrength: DistractorStrength;

  decisionHorizon: DecisionHorizon;

  principleAlignment: string;

  leadershipDimension: string;

  systemsThinkingDimension: string;

  cognitiveLoad: number;

  estimatedPMIDifficulty: number;

  qualityScore: number;

  generationVersion: string;

  promptVersion: string;
}