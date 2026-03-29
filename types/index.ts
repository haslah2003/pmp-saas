export type UserRole = 'free' | 'premium' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  subscription_tier: 'free' | 'monthly' | 'quarterly' | 'annual';
  subscription_status: 'active' | 'cancelled' | 'expired' | 'trialing';
  created_at: string;
  last_active: string;
}

export interface BrandingConfig {
  site_name: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  dark_mode_primary: string;
  font_heading: string;
  font_body: string;
}

export type MindMapMode = 'pmbok7' | 'eco2021';

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  children?: MindMapNode[];
  color?: string;
  icon?: string;
}

export type StudyTab = 'notes' | 'audio' | 'flashcards' | 'quiz';

export interface QuizQuestion {
  id: string;
  stem: string;
  options: { key: string; text: string }[];
  correct_key: string;
  explanation: string;
  domain: string;
  source: 'pmbok7' | 'eco2021';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: { title: string; reference: string }[];
}

export interface AnalyticsOverview {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  active_users_month: number;
  premium_users: number;
  free_users: number;
  conversion_rate: number;
  mrr: number;
  arr: number;
  churn_rate: number;
  retention_rate_30d: number;
  avg_session_duration: number;
}

export interface FeatureUsage {
  feature: string;
  total_sessions: number;
  unique_users: number;
  avg_duration_minutes: number;
  premium_only: boolean;
}
