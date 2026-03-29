-- =============================================================================
-- PMP Expert Tutor — Phase 2 Database Schema
-- Supabase (PostgreSQL) Migration
-- =============================================================================

-- ── Users / Profiles ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'premium', 'admin')),
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'monthly', 'quarterly', 'annual')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'trialing')),
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  paypal_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Branding Config (singleton for admin) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS branding_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'PMP Expert Tutor',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  primary_color TEXT NOT NULL DEFAULT '#0F172A',
  secondary_color TEXT NOT NULL DEFAULT '#1E40AF',
  accent_color TEXT NOT NULL DEFAULT '#F59E0B',
  dark_mode_primary TEXT NOT NULL DEFAULT '#0F172A',
  font_heading TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
  font_body TEXT NOT NULL DEFAULT 'DM Sans',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO branding_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ── Study Notes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_study_notes_user ON study_notes(user_id);

-- ── Flashcard Progress ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  flashcard_id TEXT NOT NULL,
  mastery INTEGER NOT NULL DEFAULT 0 CHECK (mastery >= 0 AND mastery <= 100),
  times_reviewed INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, flashcard_id)
);

-- ── Practice Sessions ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  domain_filter TEXT,
  difficulty_filter TEXT,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_practice_user ON practice_sessions(user_id);

-- ── Practice Answers ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS practice_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  selected_key TEXT NOT NULL,
  correct_key TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Mock Exams ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mock_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL DEFAULT 180,
  time_limit_minutes INTEGER NOT NULL DEFAULT 230,
  score NUMERIC(5,2),
  passed BOOLEAN,
  answers JSONB DEFAULT '{}',
  flagged TEXT[] DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_mock_user ON mock_exams(user_id);

-- ── AI Tutor Sessions ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tutor_user ON tutor_sessions(user_id);

-- ── Course Progress ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, module_id, lesson_id)
);

CREATE INDEX idx_course_user ON course_progress(user_id);

-- ── Analytics Events ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  feature TEXT,
  session_duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_feature ON analytics_events(feature);

-- ── PayPal Webhooks ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS paypal_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  resource JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── RLS Policies ────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users access own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users access own notes" ON study_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own flashcards" ON flashcard_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own practice" ON practice_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own practice answers" ON practice_answers FOR ALL USING (
  session_id IN (SELECT id FROM practice_sessions WHERE user_id = auth.uid())
);
CREATE POLICY "Users access own exams" ON mock_exams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own tutor" ON tutor_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own course progress" ON course_progress FOR ALL USING (auth.uid() = user_id);

-- Branding: readable by all, writable by admin only
ALTER TABLE branding_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read branding" ON branding_config FOR SELECT USING (true);
CREATE POLICY "Admin can update branding" ON branding_config FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Analytics: admin can read all
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can read analytics" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Service can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);
