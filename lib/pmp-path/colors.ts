/**
 * lib/pmp-path/colors.ts
 * PMPeco brand palette + per-phase theme tokens for My PMP Path.
 * All values are hex literals so the components work with any Tailwind config.
 */

import type { PhaseId, TrackId } from './types';

// ============================================================
// PMPeco brand palette
// ============================================================

export const BRAND = {
  teal: '#1AB0A2',
  tealDark: '#0F6E56',
  tealPale: '#E6F8F6',
  tealText: '#04342C',

  purple: '#5B2D91',
  purpleDark: '#472272',
  purplePale: '#F0EAFA',
  purpleText: '#26215C',
  purplePalest: '#ECE5F4',

  amber: '#F5A623',
  amberDark: '#854F0B',
  amberPale: '#FFF7E6',
  amberText: '#412402',

  dark: '#1A1430',
  muted: '#5E6078',
  surface: '#FFFFFF',
  surfaceMuted: '#FAFAF9',
  border: 'rgba(26,20,48,0.12)',
  borderSoft: 'rgba(26,20,48,0.08)',
} as const;

// ============================================================
// Per-phase visual theme
// (Foundation → Teal · Mastery → Purple · Integration → Amber · Simulation → Deep Purple)
// ============================================================

export interface PhaseTheme {
  /** Solid background for the phase marker circle and the active-CTA buttons */
  primary: string;
  /** Pale background for chips, badges, soft panels */
  pale: string;
  /** Palest background for the segmented bar */
  palest: string;
  /** Strong text color for use on pale backgrounds */
  textOnPale: string;
  /** Text color for use on primary backgrounds (always white in this design) */
  textOnPrimary: string;
}

export const PHASE_THEME: Record<PhaseId, PhaseTheme> = {
  foundation: {
    primary: BRAND.teal,
    pale: BRAND.tealPale,
    palest: BRAND.tealPale,
    textOnPale: BRAND.tealDark,
    textOnPrimary: '#FFFFFF',
  },
  mastery: {
    primary: BRAND.purple,
    pale: BRAND.purplePale,
    palest: BRAND.purplePalest,
    textOnPale: BRAND.purpleText,
    textOnPrimary: '#FFFFFF',
  },
  integration: {
    primary: BRAND.amber,
    pale: BRAND.amberPale,
    palest: BRAND.amberPale,
    textOnPale: BRAND.amberDark,
    textOnPrimary: '#FFFFFF',
  },
  simulation: {
    primary: BRAND.purpleDark,
    pale: BRAND.purplePalest,
    palest: BRAND.purplePalest,
    textOnPale: BRAND.purpleText,
    textOnPrimary: '#FFFFFF',
  },
};

export function themeFor(phaseId: PhaseId): PhaseTheme {
  return PHASE_THEME[phaseId];
}

// ============================================================
// Track identity (used on the tab bar — subtle, secondary to phase colors)
// ============================================================

export interface TrackIdentity {
  /** Tab-active underline color */
  accent: string;
  /** Icon color in the active state */
  iconActive: string;
  /** Pale background used for the "Active · TRACK NAME" pill in the hero */
  pillBg: string;
  /** Text color used on pillBg */
  pillText: string;
}

export const TRACK_IDENTITY: Record<TrackId, TrackIdentity> = {
  'pmbok7-eco2021': {
    accent: BRAND.purple,
    iconActive: BRAND.purple,
    pillBg: BRAND.purplePale,
    pillText: BRAND.purpleText,
  },
  'pmbok8-eco2026': {
    accent: BRAND.teal,
    iconActive: BRAND.teal,
    pillBg: BRAND.tealPale,
    pillText: BRAND.tealDark,
  },
  'bridge-7-to-8': {
    accent: BRAND.amber,
    iconActive: BRAND.amber,
    pillBg: BRAND.amberPale,
    pillText: BRAND.amberDark,
  },
};
