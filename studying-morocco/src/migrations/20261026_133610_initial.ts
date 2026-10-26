import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_universities_languages" AS ENUM('ar', 'fr', 'en');
  CREATE TYPE "public"."enum_universities_admission_channels" AS ENUM('direct', 'amci', 'exchange', 'platform');
  CREATE TYPE "public"."enum_universities_type" AS ENUM('public', 'private', 'partnership', 'traditional');
  CREATE TYPE "public"."enum_programs_languages" AS ENUM('ar', 'fr', 'en');
  CREATE TYPE "public"."enum_programs_level" AS ENUM('foundation', 'language', 'bachelor', 'master', 'doctorate', 'medicine', 'executive');
  CREATE TYPE "public"."enum_programs_study_mode" AS ENUM('full-time', 'flexible');
  CREATE TYPE "public"."enum_cities_art_variant" AS ENUM('imperial', 'coast', 'mountain', 'desert', 'modern');
  CREATE TYPE "public"."enum_disciplines_icon" AS ENUM('graduation-cap', 'building', 'home', 'plane', 'bus', 'book-open', 'languages', 'badge-check', 'shield-check', 'heart-pulse', 'users', 'briefcase', 'scale', 'stethoscope', 'cpu', 'landmark', 'calculator', 'globe', 'wallet', 'sun', 'map-pin', 'sparkles', 'clock', 'message-circle', 'file-check', 'moon-star', 'palette', 'leaf', 'compass', 'baby');
  CREATE TYPE "public"."enum_scholarships_levels" AS ENUM('foundation', 'language', 'bachelor', 'master', 'doctorate', 'medicine', 'executive');
  CREATE TYPE "public"."enum_services_currency" AS ENUM('MAD', 'USD', 'EUR', 'GBP', 'OMR', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'JOD', 'IQD', 'XOF');
  CREATE TYPE "public"."enum_services_service_key" AS ENUM('placement', 'accommodation', 'airport', 'transport', 'academic', 'language', 'residency', 'equivalence', 'insurance', 'family', 'guardianship', 'career');
  CREATE TYPE "public"."enum_services_category" AS ENUM('core', 'addon', 'family');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('graduation-cap', 'building', 'home', 'plane', 'bus', 'book-open', 'languages', 'badge-check', 'shield-check', 'heart-pulse', 'users', 'briefcase', 'scale', 'stethoscope', 'cpu', 'landmark', 'calculator', 'globe', 'wallet', 'sun', 'map-pin', 'sparkles', 'clock', 'message-circle', 'file-check', 'moon-star', 'palette', 'leaf', 'compass', 'baby');
  CREATE TYPE "public"."enum_packages_currency" AS ENUM('MAD', 'USD', 'EUR', 'GBP', 'OMR', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'JOD', 'IQD', 'XOF');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('home', 'page');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_items_icon" AS ENUM('graduation-cap', 'building', 'home', 'plane', 'bus', 'book-open', 'languages', 'badge-check', 'shield-check', 'heart-pulse', 'users', 'briefcase', 'scale', 'stethoscope', 'cpu', 'landmark', 'calculator', 'globe', 'wallet', 'sun', 'map-pin', 'sparkles', 'clock', 'message-circle', 'file-check', 'moon-star', 'palette', 'leaf', 'compass', 'baby');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_layout" AS ENUM('bento', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_audiences_items_icon" AS ENUM('graduation-cap', 'building', 'home', 'plane', 'bus', 'book-open', 'languages', 'badge-check', 'shield-check', 'heart-pulse', 'users', 'briefcase', 'scale', 'stethoscope', 'cpu', 'landmark', 'calculator', 'globe', 'wallet', 'sun', 'map-pin', 'sparkles', 'clock', 'message-circle', 'file-check', 'moon-star', 'palette', 'leaf', 'compass', 'baby');
  CREATE TYPE "public"."enum_pages_blocks_faq_category" AS ENUM('general', 'admissions', 'costs', 'gcc', 'visa', 'living', 'families');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('home', 'page');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon" AS ENUM('graduation-cap', 'building', 'home', 'plane', 'bus', 'book-open', 'languages', 'badge-check', 'shield-check', 'heart-pulse', 'users', 'briefcase', 'scale', 'stethoscope', 'cpu', 'landmark', 'calculator', 'globe', 'wallet', 'sun', 'map-pin', 'sparkles', 'clock', 'message-circle', 'file-check', 'moon-star', 'palette', 'leaf', 'compass', 'baby');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_layout" AS ENUM('bento', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_audiences_items_icon" AS ENUM('graduation-cap', 'building', 'home', 'plane', 'bus', 'book-open', 'languages', 'badge-check', 'shield-check', 'heart-pulse', 'users', 'briefcase', 'scale', 'stethoscope', 'cpu', 'landmark', 'calculator', 'globe', 'wallet', 'sun', 'map-pin', 'sparkles', 'clock', 'message-circle', 'file-check', 'moon-star', 'palette', 'leaf', 'compass', 'baby');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_category" AS ENUM('general', 'admissions', 'costs', 'gcc', 'visa', 'living', 'families');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('general', 'admissions', 'costs', 'gcc', 'visa', 'living', 'families');
  CREATE TYPE "public"."enum_testimonials_country" AS ENUM('OM', 'AE', 'QA', 'SA', 'KW', 'BH', 'JO', 'LB', 'SY', 'IQ', 'PS', 'EG', 'YE', 'LY', 'SD', 'GB', 'FR', 'DE', 'BE', 'NL', 'ES', 'IT', 'SE', 'IE', 'NG', 'SN', 'CI', 'ML', 'GN', 'MR', 'NE', 'TD', 'CM', 'GH', 'KE', 'ET', 'SO', 'GA', 'TG', 'BJ', 'BF', 'US', 'CA', 'TR', 'MY', 'XX');
  CREATE TYPE "public"."enum_applications_services" AS ENUM('placement', 'accommodation', 'airport', 'transport', 'academic', 'language', 'residency', 'equivalence', 'insurance', 'family', 'guardianship', 'career');
  CREATE TYPE "public"."enum_applications_status_history_status" AS ENUM('new', 'contacted', 'qualified', 'documents', 'submitted', 'offer', 'visa', 'arrived', 'enrolled', 'on-hold', 'lost');
  CREATE TYPE "public"."enum_applications_nationality" AS ENUM('OM', 'AE', 'QA', 'SA', 'KW', 'BH', 'JO', 'LB', 'SY', 'IQ', 'PS', 'EG', 'YE', 'LY', 'SD', 'GB', 'FR', 'DE', 'BE', 'NL', 'ES', 'IT', 'SE', 'IE', 'NG', 'SN', 'CI', 'ML', 'GN', 'MR', 'NE', 'TD', 'CM', 'GH', 'KE', 'ET', 'SO', 'GA', 'TG', 'BJ', 'BF', 'US', 'CA', 'TR', 'MY', 'XX');
  CREATE TYPE "public"."enum_applications_residence" AS ENUM('OM', 'AE', 'QA', 'SA', 'KW', 'BH', 'JO', 'LB', 'SY', 'IQ', 'PS', 'EG', 'YE', 'LY', 'SD', 'GB', 'FR', 'DE', 'BE', 'NL', 'ES', 'IT', 'SE', 'IE', 'NG', 'SN', 'CI', 'ML', 'GN', 'MR', 'NE', 'TD', 'CM', 'GH', 'KE', 'ET', 'SO', 'GA', 'TG', 'BJ', 'BF', 'US', 'CA', 'TR', 'MY', 'XX');
  CREATE TYPE "public"."enum_applications_applicant_type" AS ENUM('student', 'parent', 'family');
  CREATE TYPE "public"."enum_applications_level" AS ENUM('foundation', 'language', 'bachelor', 'master', 'doctorate', 'medicine', 'executive');
  CREATE TYPE "public"."enum_applications_teaching_language" AS ENUM('ar', 'fr', 'en');
  CREATE TYPE "public"."enum_applications_french_level" AS ENUM('none', 'basic', 'intermediate', 'advanced', 'native');
  CREATE TYPE "public"."enum_applications_english_level" AS ENUM('none', 'basic', 'intermediate', 'advanced', 'native');
  CREATE TYPE "public"."enum_applications_budget" AS ENUM('free', 'under-5k', '5k-10k', '10k-15k', 'over-15k');
  CREATE TYPE "public"."enum_applications_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_applications_status" AS ENUM('new', 'contacted', 'qualified', 'documents', 'submitted', 'offer', 'visa', 'arrived', 'enrolled', 'on-hold', 'lost');
  CREATE TYPE "public"."enum_applications_priority" AS ENUM('low', 'normal', 'high');
  CREATE TYPE "public"."enum_inquiries_country" AS ENUM('OM', 'AE', 'QA', 'SA', 'KW', 'BH', 'JO', 'LB', 'SY', 'IQ', 'PS', 'EG', 'YE', 'LY', 'SD', 'GB', 'FR', 'DE', 'BE', 'NL', 'ES', 'IT', 'SE', 'IE', 'NG', 'SN', 'CI', 'ML', 'GN', 'MR', 'NE', 'TD', 'CM', 'GH', 'KE', 'ET', 'SO', 'GA', 'TG', 'BJ', 'BF', 'US', 'CA', 'TR', 'MY', 'XX');
  CREATE TYPE "public"."enum_inquiries_preferred_channel" AS ENUM('whatsapp', 'phone', 'video', 'email');
  CREATE TYPE "public"."enum_inquiries_preferred_time" AS ENUM('morning', 'afternoon', 'evening');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('consultation', 'contact', 'callback', 'partnership');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'scheduled', 'done', 'spam');
  CREATE TYPE "public"."enum_inquiries_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_subscribers_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_subscribers_status" AS ENUM('active', 'unsubscribed');
  CREATE TYPE "public"."enum_analytics_events_type" AS ENUM('pageview', 'event');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'counselor');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x', 'snapchat', 'telegram');
  CREATE TYPE "public"."enum_calculator_rates_currency" AS ENUM('MAD', 'USD', 'EUR', 'GBP', 'OMR', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'JOD', 'IQD', 'XOF');
  CREATE TYPE "public"."enum_calculator_benchmarks_currency" AS ENUM('MAD', 'USD', 'EUR', 'GBP', 'OMR', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'JOD', 'IQD', 'XOF');
  CREATE TABLE "universities_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "universities_highlights_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "universities_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_universities_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "universities_admission_channels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_universities_admission_channels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "universities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"short_name" varchar,
  	"founded" numeric,
  	"website" varchar,
  	"tuition_min" numeric,
  	"tuition_max" numeric,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"type" "enum_universities_type" DEFAULT 'public' NOT NULL,
  	"city_id" integer NOT NULL,
  	"logo_id" integer,
  	"cover_id" integer,
  	"color" varchar DEFAULT '#0F6E5F',
  	"last_verified" timestamp(3) with time zone,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "universities_locales" (
  	"name" varchar NOT NULL,
  	"summary" varchar,
  	"description" jsonb,
  	"tuition_note" varchar,
  	"application_window" varchar,
  	"admission_notes" varchar,
  	"scholarships_info" varchar,
  	"gcc_note" varchar,
  	"international_students" varchar,
  	"accreditation" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "programs_career_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_career_outcomes_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_requirements_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_programs_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tuition_per_year" numeric,
  	"duration_years" numeric,
  	"scholarship_available" boolean DEFAULT false,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"university_id" integer NOT NULL,
  	"level" "enum_programs_level" NOT NULL,
  	"discipline_id" integer,
  	"study_mode" "enum_programs_study_mode" DEFAULT 'full-time',
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "programs_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"description" jsonb,
  	"intakes" varchar,
  	"tuition_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cities_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cities_highlights_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"rent_residence" numeric DEFAULT 1500,
  	"rent_shared" numeric DEFAULT 2200,
  	"rent_studio" numeric DEFAULT 4000,
  	"homestay" numeric DEFAULT 4200,
  	"food" numeric DEFAULT 1800,
  	"transport" numeric DEFAULT 300,
  	"utilities" numeric DEFAULT 400,
  	"leisure" numeric DEFAULT 700,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"art_variant" "enum_cities_art_variant" DEFAULT 'imperial',
  	"image_id" integer,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities_locales" (
  	"name" varchar NOT NULL,
  	"region" varchar,
  	"tagline" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"climate" varchar,
  	"flight_times" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "disciplines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"icon" "enum_disciplines_icon",
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "disciplines_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "scholarships_levels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_scholarships_levels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "scholarships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"link" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "scholarships_locales" (
  	"name" varchar NOT NULL,
  	"provider" varchar,
  	"coverage" varchar,
  	"eligibility" varchar,
  	"how_to_apply" varchar,
  	"amount" varchar,
  	"deadline" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "scholarships_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"universities_id" integer
  );
  
  CREATE TABLE "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_steps_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price_from" numeric,
  	"currency" "enum_services_currency" DEFAULT 'USD',
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"service_key" "enum_services_service_key",
  	"category" "enum_services_category" DEFAULT 'core',
  	"icon" "enum_services_icon",
  	"image_id" integer,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"description" jsonb,
  	"price_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"included" boolean DEFAULT true
  );
  
  CREATE TABLE "packages_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric,
  	"currency" "enum_packages_currency" DEFAULT 'USD',
  	"highlighted" boolean DEFAULT false,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "packages_locales" (
  	"name" varchar NOT NULL,
  	"tagline" varchar,
  	"price_suffix" varchar,
  	"badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_chips_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'home',
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"show_search" boolean DEFAULT true,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"highlight" varchar,
  	"subheading" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_grid_items_icon"
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"stat" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_feature_grid_layout" DEFAULT 'bento',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_audiences_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_audiences_items_icon",
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_audiences_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_audiences_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"only_featured" boolean DEFAULT true,
  	"show_packages" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_grid_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_universities_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_universities_showcase_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cities_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cities_showcase_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"duration" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cost_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cost_comparison_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_comparison_rows_locales" (
  	"label" varchar,
  	"a" varchar,
  	"b" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"label_a" varchar,
  	"label_b" varchar,
  	"footnote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_pages_blocks_faq_category",
  	"limit" numeric DEFAULT 8,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_posts_feed_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_program_search" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_program_search_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"narrow" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"show_in_footer" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"universities_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_chips_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'home',
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"show_search" boolean DEFAULT true,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"highlight" varchar,
  	"subheading" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_grid_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"stat" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_feature_grid_layout" DEFAULT 'bento',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_audiences_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_audiences_items_icon",
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_audiences_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_audiences_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"only_featured" boolean DEFAULT true,
  	"show_packages" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_universities_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_universities_showcase_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cities_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cities_showcase_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"duration" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cost_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cost_comparison_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_rows_locales" (
  	"label" varchar,
  	"a" varchar,
  	"b" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"label_a" varchar,
  	"label_b" varchar,
  	"footnote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum__pages_v_blocks_faq_category",
  	"limit" numeric DEFAULT 8,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_posts_feed_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_program_search" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_program_search_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"narrow" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_show_in_footer" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"universities_id" integer
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"cover_id" integer,
  	"category_id" integer,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"reading_time" numeric,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_reading_time" numeric,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'general' NOT NULL,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"country" "enum_testimonials_country",
  	"rating" numeric DEFAULT 5,
  	"video_url" varchar,
  	"photo_id" integer,
  	"published" boolean DEFAULT false,
  	"consent_on_file" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials_locales" (
  	"quote" varchar NOT NULL,
  	"university" varchar,
  	"program" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "applications_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_applications_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "applications_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar NOT NULL,
  	"author_id" integer,
  	"added_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "applications_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" "enum_applications_status_history_status",
  	"changed_at" timestamp(3) with time zone,
  	"changed_by_id" integer
  );
  
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"date_of_birth" timestamp(3) with time zone,
  	"nationality" "enum_applications_nationality",
  	"residence" "enum_applications_residence",
  	"applicant_type" "enum_applications_applicant_type" DEFAULT 'student',
  	"guardian_name" varchar,
  	"children" numeric,
  	"level" "enum_applications_level",
  	"discipline_id" integer,
  	"intake" varchar,
  	"program_id" integer,
  	"teaching_language" "enum_applications_teaching_language",
  	"french_level" "enum_applications_french_level",
  	"english_level" "enum_applications_english_level",
  	"current_education" varchar,
  	"grade" varchar,
  	"budget" "enum_applications_budget",
  	"message" varchar,
  	"locale" "enum_applications_locale",
  	"landing_page" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"referrer" varchar,
  	"consent" boolean,
  	"consent_at" timestamp(3) with time zone,
  	"reference" varchar,
  	"status" "enum_applications_status" DEFAULT 'new' NOT NULL,
  	"priority" "enum_applications_priority" DEFAULT 'normal',
  	"assigned_to_id" integer,
  	"public_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "applications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"universities_id" integer,
  	"cities_id" integer
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country" "enum_inquiries_country",
  	"preferred_channel" "enum_inquiries_preferred_channel",
  	"preferred_date" timestamp(3) with time zone,
  	"preferred_time" "enum_inquiries_preferred_time",
  	"subject" varchar,
  	"message" varchar,
  	"internal_notes" varchar,
  	"type" "enum_inquiries_type" DEFAULT 'contact' NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"assigned_to_id" integer,
  	"locale" "enum_inquiries_locale",
  	"source_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"locale" "enum_subscribers_locale",
  	"status" "enum_subscribers_status" DEFAULT 'active',
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_analytics_events_type" DEFAULT 'pageview' NOT NULL,
  	"name" varchar,
  	"path" varchar,
  	"locale" varchar,
  	"referrer" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"country" varchar,
  	"device" varchar,
  	"browser" varchar,
  	"visitor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_locales" (
  	"job_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"universities_id" integer,
  	"programs_id" integer,
  	"services_id" integer,
  	"cities_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"universities_id" integer,
  	"programs_id" integer,
  	"cities_id" integer,
  	"disciplines_id" integer,
  	"scholarships_id" integer,
  	"services_id" integer,
  	"packages_id" integer,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"faqs_id" integer,
  	"testimonials_id" integer,
  	"media_id" integer,
  	"applications_id" integer,
  	"inquiries_id" integer,
  	"subscribers_id" integer,
  	"analytics_events_id" integer,
  	"users_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_stats_locales" (
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_on_dark_id" integer,
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_href" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"map_url" varchar,
  	"notification_emails" varchar,
  	"brand_primary" varchar DEFAULT '#0F6E5F',
  	"brand_secondary" varchar DEFAULT '#13253D',
  	"brand_accent" varchar DEFAULT '#D4A24C',
  	"brand_clay" varchar DEFAULT '#C2603F',
  	"brand_ink" varchar DEFAULT '#18202B',
  	"brand_canvas" varchar DEFAULT '#FBF8F2',
  	"og_image_id" integer,
  	"google_site_verification" varchar,
  	"bing_site_verification" varchar,
  	"ga4_id" varchar,
  	"meta_pixel_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar NOT NULL,
  	"tagline" varchar,
  	"organization" varchar,
  	"announcement_text" varchar,
  	"address" varchar,
  	"office_hours" varchar,
  	"default_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_header_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header_children_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_footer_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"footer_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "calculator_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"currency" "enum_calculator_rates_currency" NOT NULL,
  	"mad_per_unit" numeric NOT NULL
  );
  
  CREATE TABLE "calculator_benchmarks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tuition" numeric NOT NULL,
  	"living" numeric NOT NULL,
  	"currency" "enum_calculator_benchmarks_currency" DEFAULT 'EUR' NOT NULL
  );
  
  CREATE TABLE "calculator_benchmarks_locales" (
  	"label" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "calculator" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"rates_updated" timestamp(3) with time zone,
  	"tuition_public_flexible" numeric DEFAULT 15000,
  	"tuition_private_min" numeric DEFAULT 50000,
  	"tuition_private_max" numeric DEFAULT 130000,
  	"tuition_one_time_setup" numeric DEFAULT 6000,
  	"tuition_insurance_per_year" numeric DEFAULT 3000,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "calculator_locales" (
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "universities_highlights" ADD CONSTRAINT "universities_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universities_highlights_locales" ADD CONSTRAINT "universities_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."universities_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universities_languages" ADD CONSTRAINT "universities_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universities_admission_channels" ADD CONSTRAINT "universities_admission_channels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universities" ADD CONSTRAINT "universities_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universities" ADD CONSTRAINT "universities_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universities" ADD CONSTRAINT "universities_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universities_locales" ADD CONSTRAINT "universities_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universities_locales" ADD CONSTRAINT "universities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_career_outcomes" ADD CONSTRAINT "programs_career_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_career_outcomes_locales" ADD CONSTRAINT "programs_career_outcomes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_career_outcomes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_requirements" ADD CONSTRAINT "programs_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_requirements_locales" ADD CONSTRAINT "programs_requirements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_requirements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_languages" ADD CONSTRAINT "programs_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_locales" ADD CONSTRAINT "programs_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_locales" ADD CONSTRAINT "programs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_highlights" ADD CONSTRAINT "cities_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_highlights_locales" ADD CONSTRAINT "cities_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities_locales" ADD CONSTRAINT "cities_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities_locales" ADD CONSTRAINT "cities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "disciplines_locales" ADD CONSTRAINT "disciplines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scholarships_levels" ADD CONSTRAINT "scholarships_levels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scholarships_locales" ADD CONSTRAINT "scholarships_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scholarships_locales" ADD CONSTRAINT "scholarships_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scholarships_rels" ADD CONSTRAINT "scholarships_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scholarships_rels" ADD CONSTRAINT "scholarships_rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features_locales" ADD CONSTRAINT "services_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_steps" ADD CONSTRAINT "services_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_steps_locales" ADD CONSTRAINT "services_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_features" ADD CONSTRAINT "packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_features_locales" ADD CONSTRAINT "packages_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_locales" ADD CONSTRAINT "packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_chips" ADD CONSTRAINT "pages_blocks_hero_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_chips_locales" ADD CONSTRAINT "pages_blocks_hero_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items_locales" ADD CONSTRAINT "pages_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items_locales" ADD CONSTRAINT "pages_blocks_feature_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_locales" ADD CONSTRAINT "pages_blocks_feature_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audiences_items" ADD CONSTRAINT "pages_blocks_audiences_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audiences_items_locales" ADD CONSTRAINT "pages_blocks_audiences_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audiences_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audiences" ADD CONSTRAINT "pages_blocks_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_audiences_locales" ADD CONSTRAINT "pages_blocks_audiences_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_locales" ADD CONSTRAINT "pages_blocks_services_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_universities_showcase" ADD CONSTRAINT "pages_blocks_universities_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_universities_showcase_locales" ADD CONSTRAINT "pages_blocks_universities_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_universities_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cities_showcase" ADD CONSTRAINT "pages_blocks_cities_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cities_showcase_locales" ADD CONSTRAINT "pages_blocks_cities_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cities_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_steps" ADD CONSTRAINT "pages_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_steps_locales" ADD CONSTRAINT "pages_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps" ADD CONSTRAINT "pages_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_locales" ADD CONSTRAINT "pages_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cost_comparison" ADD CONSTRAINT "pages_blocks_cost_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cost_comparison_locales" ADD CONSTRAINT "pages_blocks_cost_comparison_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cost_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows" ADD CONSTRAINT "pages_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows_locales" ADD CONSTRAINT "pages_blocks_comparison_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison" ADD CONSTRAINT "pages_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_locales" ADD CONSTRAINT "pages_blocks_comparison_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_locales" ADD CONSTRAINT "pages_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_posts_feed" ADD CONSTRAINT "pages_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_posts_feed_locales" ADD CONSTRAINT "pages_blocks_posts_feed_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_posts_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_program_search" ADD CONSTRAINT "pages_blocks_program_search_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_program_search_locales" ADD CONSTRAINT "pages_blocks_program_search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_program_search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_locales" ADD CONSTRAINT "pages_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter_locales" ADD CONSTRAINT "pages_blocks_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_chips" ADD CONSTRAINT "_pages_v_blocks_hero_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_chips_locales" ADD CONSTRAINT "_pages_v_blocks_hero_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD CONSTRAINT "_pages_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items_locales" ADD CONSTRAINT "_pages_v_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items_locales" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_locales" ADD CONSTRAINT "_pages_v_blocks_feature_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audiences_items" ADD CONSTRAINT "_pages_v_blocks_audiences_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audiences_items_locales" ADD CONSTRAINT "_pages_v_blocks_audiences_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audiences_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audiences" ADD CONSTRAINT "_pages_v_blocks_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_audiences_locales" ADD CONSTRAINT "_pages_v_blocks_audiences_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD CONSTRAINT "_pages_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_locales" ADD CONSTRAINT "_pages_v_blocks_services_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_universities_showcase" ADD CONSTRAINT "_pages_v_blocks_universities_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_universities_showcase_locales" ADD CONSTRAINT "_pages_v_blocks_universities_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_universities_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cities_showcase" ADD CONSTRAINT "_pages_v_blocks_cities_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cities_showcase_locales" ADD CONSTRAINT "_pages_v_blocks_cities_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cities_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps_locales" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_locales" ADD CONSTRAINT "_pages_v_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cost_comparison" ADD CONSTRAINT "_pages_v_blocks_cost_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cost_comparison_locales" ADD CONSTRAINT "_pages_v_blocks_cost_comparison_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cost_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows_locales" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison" ADD CONSTRAINT "_pages_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_locales" ADD CONSTRAINT "_pages_v_blocks_comparison_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_locales" ADD CONSTRAINT "_pages_v_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_posts_feed" ADD CONSTRAINT "_pages_v_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_posts_feed_locales" ADD CONSTRAINT "_pages_v_blocks_posts_feed_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_posts_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_program_search" ADD CONSTRAINT "_pages_v_blocks_program_search_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_program_search_locales" ADD CONSTRAINT "_pages_v_blocks_program_search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_program_search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD CONSTRAINT "_pages_v_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_locales" ADD CONSTRAINT "_pages_v_blocks_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_services" ADD CONSTRAINT "applications_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_notes" ADD CONSTRAINT "applications_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_notes" ADD CONSTRAINT "applications_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_status_history" ADD CONSTRAINT "applications_status_history_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_status_history" ADD CONSTRAINT "applications_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_rels" ADD CONSTRAINT "applications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_rels" ADD CONSTRAINT "applications_rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_rels" ADD CONSTRAINT "applications_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_disciplines_fk" FOREIGN KEY ("disciplines_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scholarships_fk" FOREIGN KEY ("scholarships_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_events_fk" FOREIGN KEY ("analytics_events_id") REFERENCES "public"."analytics_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats_locales" ADD CONSTRAINT "site_settings_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_on_dark_id_media_id_fk" FOREIGN KEY ("logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_children_locales" ADD CONSTRAINT "navigation_header_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_locales" ADD CONSTRAINT "navigation_header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links_locales" ADD CONSTRAINT "navigation_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer" ADD CONSTRAINT "navigation_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_locales" ADD CONSTRAINT "navigation_footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calculator_rates" ADD CONSTRAINT "calculator_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calculator"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calculator_benchmarks" ADD CONSTRAINT "calculator_benchmarks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calculator"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calculator_benchmarks_locales" ADD CONSTRAINT "calculator_benchmarks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calculator_benchmarks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calculator_locales" ADD CONSTRAINT "calculator_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calculator"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "universities_highlights_order_idx" ON "universities_highlights" USING btree ("_order");
  CREATE INDEX "universities_highlights_parent_id_idx" ON "universities_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "universities_highlights_locales_locale_parent_id_unique" ON "universities_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "universities_highlights_locales_parent_id_idx" ON "universities_highlights_locales" USING btree ("_parent_id");
  CREATE INDEX "universities_languages_order_idx" ON "universities_languages" USING btree ("order");
  CREATE INDEX "universities_languages_parent_idx" ON "universities_languages" USING btree ("parent_id");
  CREATE INDEX "universities_admission_channels_order_idx" ON "universities_admission_channels" USING btree ("order");
  CREATE INDEX "universities_admission_channels_parent_idx" ON "universities_admission_channels" USING btree ("parent_id");
  CREATE UNIQUE INDEX "universities_slug_idx" ON "universities" USING btree ("slug");
  CREATE INDEX "universities_type_idx" ON "universities" USING btree ("type");
  CREATE INDEX "universities_city_idx" ON "universities" USING btree ("city_id");
  CREATE INDEX "universities_logo_idx" ON "universities" USING btree ("logo_id");
  CREATE INDEX "universities_cover_idx" ON "universities" USING btree ("cover_id");
  CREATE INDEX "universities_published_idx" ON "universities" USING btree ("published");
  CREATE INDEX "universities_featured_idx" ON "universities" USING btree ("featured");
  CREATE INDEX "universities_updated_at_idx" ON "universities" USING btree ("updated_at");
  CREATE INDEX "universities_created_at_idx" ON "universities" USING btree ("created_at");
  CREATE INDEX "universities_meta_meta_image_idx" ON "universities_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "universities_locales_locale_parent_id_unique" ON "universities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "universities_locales_parent_id_idx" ON "universities_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_career_outcomes_order_idx" ON "programs_career_outcomes" USING btree ("_order");
  CREATE INDEX "programs_career_outcomes_parent_id_idx" ON "programs_career_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_career_outcomes_locales_locale_parent_id_unique" ON "programs_career_outcomes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_career_outcomes_locales_parent_id_idx" ON "programs_career_outcomes_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_requirements_order_idx" ON "programs_requirements" USING btree ("_order");
  CREATE INDEX "programs_requirements_parent_id_idx" ON "programs_requirements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_requirements_locales_locale_parent_id_unique" ON "programs_requirements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_requirements_locales_parent_id_idx" ON "programs_requirements_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_languages_order_idx" ON "programs_languages" USING btree ("order");
  CREATE INDEX "programs_languages_parent_idx" ON "programs_languages" USING btree ("parent_id");
  CREATE INDEX "programs_tuition_per_year_idx" ON "programs" USING btree ("tuition_per_year");
  CREATE UNIQUE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_university_idx" ON "programs" USING btree ("university_id");
  CREATE INDEX "programs_level_idx" ON "programs" USING btree ("level");
  CREATE INDEX "programs_discipline_idx" ON "programs" USING btree ("discipline_id");
  CREATE INDEX "programs_published_idx" ON "programs" USING btree ("published");
  CREATE INDEX "programs_featured_idx" ON "programs" USING btree ("featured");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs_meta_meta_image_idx" ON "programs_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "programs_locales_locale_parent_id_unique" ON "programs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_locales_parent_id_idx" ON "programs_locales" USING btree ("_parent_id");
  CREATE INDEX "cities_highlights_order_idx" ON "cities_highlights" USING btree ("_order");
  CREATE INDEX "cities_highlights_parent_id_idx" ON "cities_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cities_highlights_locales_locale_parent_id_unique" ON "cities_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cities_highlights_locales_parent_id_idx" ON "cities_highlights_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cities_slug_idx" ON "cities" USING btree ("slug");
  CREATE INDEX "cities_image_idx" ON "cities" USING btree ("image_id");
  CREATE INDEX "cities_published_idx" ON "cities" USING btree ("published");
  CREATE INDEX "cities_featured_idx" ON "cities" USING btree ("featured");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "cities_meta_meta_image_idx" ON "cities_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "cities_locales_locale_parent_id_unique" ON "cities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cities_locales_parent_id_idx" ON "cities_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "disciplines_slug_idx" ON "disciplines" USING btree ("slug");
  CREATE INDEX "disciplines_updated_at_idx" ON "disciplines" USING btree ("updated_at");
  CREATE INDEX "disciplines_created_at_idx" ON "disciplines" USING btree ("created_at");
  CREATE UNIQUE INDEX "disciplines_locales_locale_parent_id_unique" ON "disciplines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "disciplines_locales_parent_id_idx" ON "disciplines_locales" USING btree ("_parent_id");
  CREATE INDEX "scholarships_levels_order_idx" ON "scholarships_levels" USING btree ("order");
  CREATE INDEX "scholarships_levels_parent_idx" ON "scholarships_levels" USING btree ("parent_id");
  CREATE UNIQUE INDEX "scholarships_slug_idx" ON "scholarships" USING btree ("slug");
  CREATE INDEX "scholarships_published_idx" ON "scholarships" USING btree ("published");
  CREATE INDEX "scholarships_featured_idx" ON "scholarships" USING btree ("featured");
  CREATE INDEX "scholarships_updated_at_idx" ON "scholarships" USING btree ("updated_at");
  CREATE INDEX "scholarships_created_at_idx" ON "scholarships" USING btree ("created_at");
  CREATE INDEX "scholarships_meta_meta_image_idx" ON "scholarships_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "scholarships_locales_locale_parent_id_unique" ON "scholarships_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "scholarships_locales_parent_id_idx" ON "scholarships_locales" USING btree ("_parent_id");
  CREATE INDEX "scholarships_rels_order_idx" ON "scholarships_rels" USING btree ("order");
  CREATE INDEX "scholarships_rels_parent_idx" ON "scholarships_rels" USING btree ("parent_id");
  CREATE INDEX "scholarships_rels_path_idx" ON "scholarships_rels" USING btree ("path");
  CREATE INDEX "scholarships_rels_universities_id_idx" ON "scholarships_rels" USING btree ("universities_id");
  CREATE INDEX "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_features_locales_locale_parent_id_unique" ON "services_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_features_locales_parent_id_idx" ON "services_features_locales" USING btree ("_parent_id");
  CREATE INDEX "services_steps_order_idx" ON "services_steps" USING btree ("_order");
  CREATE INDEX "services_steps_parent_id_idx" ON "services_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_steps_locales_locale_parent_id_unique" ON "services_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_steps_locales_parent_id_idx" ON "services_steps_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_published_idx" ON "services" USING btree ("published");
  CREATE INDEX "services_featured_idx" ON "services" USING btree ("featured");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_meta_meta_image_idx" ON "services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_locales_parent_id_idx" ON "services_locales" USING btree ("_parent_id");
  CREATE INDEX "packages_features_order_idx" ON "packages_features" USING btree ("_order");
  CREATE INDEX "packages_features_parent_id_idx" ON "packages_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "packages_features_locales_locale_parent_id_unique" ON "packages_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "packages_features_locales_parent_id_idx" ON "packages_features_locales" USING btree ("_parent_id");
  CREATE INDEX "packages_published_idx" ON "packages" USING btree ("published");
  CREATE INDEX "packages_updated_at_idx" ON "packages" USING btree ("updated_at");
  CREATE INDEX "packages_created_at_idx" ON "packages" USING btree ("created_at");
  CREATE UNIQUE INDEX "packages_locales_locale_parent_id_unique" ON "packages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "packages_locales_parent_id_idx" ON "packages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_chips_order_idx" ON "pages_blocks_hero_chips" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_chips_parent_id_idx" ON "pages_blocks_hero_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_chips_locales_locale_parent_id_unique" ON "pages_blocks_hero_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_chips_locales_parent_id_idx" ON "pages_blocks_hero_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_locales_parent_id_idx" ON "pages_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_items_locales_locale_parent_id_unique" ON "pages_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_items_locales_parent_id_idx" ON "pages_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_grid_items_order_idx" ON "pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_items_parent_id_idx" ON "pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_grid_items_locales_locale_parent_id_uni" ON "pages_blocks_feature_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_items_locales_parent_id_idx" ON "pages_blocks_feature_grid_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_feature_grid_locales_locale_parent_id_unique" ON "pages_blocks_feature_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_locales_parent_id_idx" ON "pages_blocks_feature_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_audiences_items_order_idx" ON "pages_blocks_audiences_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_audiences_items_parent_id_idx" ON "pages_blocks_audiences_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_audiences_items_locales_locale_parent_id_unique" ON "pages_blocks_audiences_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_audiences_items_locales_parent_id_idx" ON "pages_blocks_audiences_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_audiences_order_idx" ON "pages_blocks_audiences" USING btree ("_order");
  CREATE INDEX "pages_blocks_audiences_parent_id_idx" ON "pages_blocks_audiences" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_audiences_path_idx" ON "pages_blocks_audiences" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_audiences_locales_locale_parent_id_unique" ON "pages_blocks_audiences_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_audiences_locales_parent_id_idx" ON "pages_blocks_audiences_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_services_grid_locales_locale_parent_id_unique" ON "pages_blocks_services_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_services_grid_locales_parent_id_idx" ON "pages_blocks_services_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_universities_showcase_order_idx" ON "pages_blocks_universities_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_universities_showcase_parent_id_idx" ON "pages_blocks_universities_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_universities_showcase_path_idx" ON "pages_blocks_universities_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_universities_showcase_locales_locale_parent_id_" ON "pages_blocks_universities_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_universities_showcase_locales_parent_id_idx" ON "pages_blocks_universities_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cities_showcase_order_idx" ON "pages_blocks_cities_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_cities_showcase_parent_id_idx" ON "pages_blocks_cities_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cities_showcase_path_idx" ON "pages_blocks_cities_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cities_showcase_locales_locale_parent_id_unique" ON "pages_blocks_cities_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cities_showcase_locales_parent_id_idx" ON "pages_blocks_cities_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_steps_order_idx" ON "pages_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_steps_parent_id_idx" ON "pages_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_process_steps_steps_locales_locale_parent_id_un" ON "pages_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_process_steps_steps_locales_parent_id_idx" ON "pages_blocks_process_steps_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_order_idx" ON "pages_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_parent_id_idx" ON "pages_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_path_idx" ON "pages_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_process_steps_locales_locale_parent_id_unique" ON "pages_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_process_steps_locales_parent_id_idx" ON "pages_blocks_process_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cost_comparison_order_idx" ON "pages_blocks_cost_comparison" USING btree ("_order");
  CREATE INDEX "pages_blocks_cost_comparison_parent_id_idx" ON "pages_blocks_cost_comparison" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cost_comparison_path_idx" ON "pages_blocks_cost_comparison" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cost_comparison_locales_locale_parent_id_unique" ON "pages_blocks_cost_comparison_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cost_comparison_locales_parent_id_idx" ON "pages_blocks_cost_comparison_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_rows_order_idx" ON "pages_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_rows_parent_id_idx" ON "pages_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_comparison_rows_locales_locale_parent_id_unique" ON "pages_blocks_comparison_rows_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_comparison_rows_locales_parent_id_idx" ON "pages_blocks_comparison_rows_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_order_idx" ON "pages_blocks_comparison" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_parent_id_idx" ON "pages_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_path_idx" ON "pages_blocks_comparison" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_comparison_locales_locale_parent_id_unique" ON "pages_blocks_comparison_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_comparison_locales_parent_id_idx" ON "pages_blocks_comparison_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_testimonials_locales_locale_parent_id_unique" ON "pages_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_testimonials_locales_parent_id_idx" ON "pages_blocks_testimonials_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_locales_parent_id_idx" ON "pages_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_posts_feed_order_idx" ON "pages_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "pages_blocks_posts_feed_parent_id_idx" ON "pages_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_posts_feed_path_idx" ON "pages_blocks_posts_feed" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_posts_feed_locales_locale_parent_id_unique" ON "pages_blocks_posts_feed_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_posts_feed_locales_parent_id_idx" ON "pages_blocks_posts_feed_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_program_search_order_idx" ON "pages_blocks_program_search" USING btree ("_order");
  CREATE INDEX "pages_blocks_program_search_parent_id_idx" ON "pages_blocks_program_search" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_program_search_path_idx" ON "pages_blocks_program_search" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_program_search_locales_locale_parent_id_unique" ON "pages_blocks_program_search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_program_search_locales_parent_id_idx" ON "pages_blocks_program_search_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_rich_text_locales_locale_parent_id_unique" ON "pages_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_rich_text_locales_parent_id_idx" ON "pages_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_locales_parent_id_idx" ON "pages_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_newsletter_locales_locale_parent_id_unique" ON "pages_blocks_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_newsletter_locales_parent_id_idx" ON "pages_blocks_newsletter_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_universities_id_idx" ON "pages_rels" USING btree ("universities_id");
  CREATE INDEX "_pages_v_blocks_hero_chips_order_idx" ON "_pages_v_blocks_hero_chips" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_chips_parent_id_idx" ON "_pages_v_blocks_hero_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_chips_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_chips_locales_parent_id_idx" ON "_pages_v_blocks_hero_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_locales_parent_id_idx" ON "_pages_v_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_locales_parent_id_idx" ON "_pages_v_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_order_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_parent_id_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_grid_items_locales_locale_parent_id_" ON "_pages_v_blocks_feature_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_locales_parent_id_idx" ON "_pages_v_blocks_feature_grid_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_order_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_parent_id_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_path_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_feature_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_locales_parent_id_idx" ON "_pages_v_blocks_feature_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_audiences_items_order_idx" ON "_pages_v_blocks_audiences_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_audiences_items_parent_id_idx" ON "_pages_v_blocks_audiences_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_audiences_items_locales_locale_parent_id_uni" ON "_pages_v_blocks_audiences_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_audiences_items_locales_parent_id_idx" ON "_pages_v_blocks_audiences_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_audiences_order_idx" ON "_pages_v_blocks_audiences" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_audiences_parent_id_idx" ON "_pages_v_blocks_audiences" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_audiences_path_idx" ON "_pages_v_blocks_audiences" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_audiences_locales_locale_parent_id_unique" ON "_pages_v_blocks_audiences_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_audiences_locales_parent_id_idx" ON "_pages_v_blocks_audiences_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_order_idx" ON "_pages_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_parent_id_idx" ON "_pages_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_path_idx" ON "_pages_v_blocks_services_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_services_grid_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_services_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_locales_parent_id_idx" ON "_pages_v_blocks_services_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_universities_showcase_order_idx" ON "_pages_v_blocks_universities_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_universities_showcase_parent_id_idx" ON "_pages_v_blocks_universities_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_universities_showcase_path_idx" ON "_pages_v_blocks_universities_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_universities_showcase_locales_locale_parent_" ON "_pages_v_blocks_universities_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_universities_showcase_locales_parent_id_idx" ON "_pages_v_blocks_universities_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cities_showcase_order_idx" ON "_pages_v_blocks_cities_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cities_showcase_parent_id_idx" ON "_pages_v_blocks_cities_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cities_showcase_path_idx" ON "_pages_v_blocks_cities_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cities_showcase_locales_locale_parent_id_uni" ON "_pages_v_blocks_cities_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cities_showcase_locales_parent_id_idx" ON "_pages_v_blocks_cities_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_order_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_parent_id_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_process_steps_steps_locales_locale_parent_id" ON "_pages_v_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_locales_parent_id_idx" ON "_pages_v_blocks_process_steps_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_order_idx" ON "_pages_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_parent_id_idx" ON "_pages_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_path_idx" ON "_pages_v_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_process_steps_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_locales_parent_id_idx" ON "_pages_v_blocks_process_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cost_comparison_order_idx" ON "_pages_v_blocks_cost_comparison" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cost_comparison_parent_id_idx" ON "_pages_v_blocks_cost_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cost_comparison_path_idx" ON "_pages_v_blocks_cost_comparison" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cost_comparison_locales_locale_parent_id_uni" ON "_pages_v_blocks_cost_comparison_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cost_comparison_locales_parent_id_idx" ON "_pages_v_blocks_cost_comparison_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_rows_order_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_rows_parent_id_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_comparison_rows_locales_locale_parent_id_uni" ON "_pages_v_blocks_comparison_rows_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_rows_locales_parent_id_idx" ON "_pages_v_blocks_comparison_rows_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_order_idx" ON "_pages_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_parent_id_idx" ON "_pages_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_path_idx" ON "_pages_v_blocks_comparison" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_comparison_locales_locale_parent_id_unique" ON "_pages_v_blocks_comparison_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_locales_parent_id_idx" ON "_pages_v_blocks_comparison_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonials_locales_locale_parent_id_unique" ON "_pages_v_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_locales_parent_id_idx" ON "_pages_v_blocks_testimonials_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_locales_parent_id_idx" ON "_pages_v_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_posts_feed_order_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_posts_feed_parent_id_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_posts_feed_path_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_posts_feed_locales_locale_parent_id_unique" ON "_pages_v_blocks_posts_feed_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_posts_feed_locales_parent_id_idx" ON "_pages_v_blocks_posts_feed_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_program_search_order_idx" ON "_pages_v_blocks_program_search" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_program_search_parent_id_idx" ON "_pages_v_blocks_program_search" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_program_search_path_idx" ON "_pages_v_blocks_program_search" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_program_search_locales_locale_parent_id_uniq" ON "_pages_v_blocks_program_search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_program_search_locales_parent_id_idx" ON "_pages_v_blocks_program_search_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_rich_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_locales_parent_id_idx" ON "_pages_v_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_locales_parent_id_idx" ON "_pages_v_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_newsletter_locales_locale_parent_id_unique" ON "_pages_v_blocks_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_locales_parent_id_idx" ON "_pages_v_blocks_newsletter_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_universities_id_idx" ON "_pages_v_rels" USING btree ("universities_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_featured_idx" ON "posts" USING btree ("featured");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_version_featured_idx" ON "_posts_v" USING btree ("version_featured");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category");
  CREATE INDEX "faqs_published_idx" ON "faqs" USING btree ("published");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_locales_parent_id_idx" ON "faqs_locales" USING btree ("_parent_id");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_published_idx" ON "testimonials" USING btree ("published");
  CREATE INDEX "testimonials_featured_idx" ON "testimonials" USING btree ("featured");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_locales_parent_id_idx" ON "testimonials_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "applications_services_order_idx" ON "applications_services" USING btree ("order");
  CREATE INDEX "applications_services_parent_idx" ON "applications_services" USING btree ("parent_id");
  CREATE INDEX "applications_notes_order_idx" ON "applications_notes" USING btree ("_order");
  CREATE INDEX "applications_notes_parent_id_idx" ON "applications_notes" USING btree ("_parent_id");
  CREATE INDEX "applications_notes_author_idx" ON "applications_notes" USING btree ("author_id");
  CREATE INDEX "applications_status_history_order_idx" ON "applications_status_history" USING btree ("_order");
  CREATE INDEX "applications_status_history_parent_id_idx" ON "applications_status_history" USING btree ("_parent_id");
  CREATE INDEX "applications_status_history_changed_by_idx" ON "applications_status_history" USING btree ("changed_by_id");
  CREATE INDEX "applications_email_idx" ON "applications" USING btree ("email");
  CREATE INDEX "applications_nationality_idx" ON "applications" USING btree ("nationality");
  CREATE INDEX "applications_level_idx" ON "applications" USING btree ("level");
  CREATE INDEX "applications_discipline_idx" ON "applications" USING btree ("discipline_id");
  CREATE INDEX "applications_program_idx" ON "applications" USING btree ("program_id");
  CREATE UNIQUE INDEX "applications_reference_idx" ON "applications" USING btree ("reference");
  CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");
  CREATE INDEX "applications_assigned_to_idx" ON "applications" USING btree ("assigned_to_id");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  CREATE INDEX "applications_rels_order_idx" ON "applications_rels" USING btree ("order");
  CREATE INDEX "applications_rels_parent_idx" ON "applications_rels" USING btree ("parent_id");
  CREATE INDEX "applications_rels_path_idx" ON "applications_rels" USING btree ("path");
  CREATE INDEX "applications_rels_universities_id_idx" ON "applications_rels" USING btree ("universities_id");
  CREATE INDEX "applications_rels_cities_id_idx" ON "applications_rels" USING btree ("cities_id");
  CREATE INDEX "inquiries_type_idx" ON "inquiries" USING btree ("type");
  CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status");
  CREATE INDEX "inquiries_assigned_to_idx" ON "inquiries" USING btree ("assigned_to_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "analytics_events_name_idx" ON "analytics_events" USING btree ("name");
  CREATE INDEX "analytics_events_path_idx" ON "analytics_events" USING btree ("path");
  CREATE INDEX "analytics_events_visitor_idx" ON "analytics_events" USING btree ("visitor");
  CREATE INDEX "analytics_events_updated_at_idx" ON "analytics_events" USING btree ("updated_at");
  CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");
  CREATE INDEX "createdAt_type_idx" ON "analytics_events" USING btree ("created_at","type");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_photo_idx" ON "users" USING btree ("photo_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "users_locales_locale_parent_id_unique" ON "users_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_locales_parent_id_idx" ON "users_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_universities_id_idx" ON "redirects_rels" USING btree ("universities_id");
  CREATE INDEX "redirects_rels_programs_id_idx" ON "redirects_rels" USING btree ("programs_id");
  CREATE INDEX "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  CREATE INDEX "redirects_rels_cities_id_idx" ON "redirects_rels" USING btree ("cities_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_universities_id_idx" ON "payload_locked_documents_rels" USING btree ("universities_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_disciplines_id_idx" ON "payload_locked_documents_rels" USING btree ("disciplines_id");
  CREATE INDEX "payload_locked_documents_rels_scholarships_id_idx" ON "payload_locked_documents_rels" USING btree ("scholarships_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("packages_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_events_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_events_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_stats_locales_locale_parent_id_unique" ON "site_settings_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_stats_locales_parent_id_idx" ON "site_settings_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_on_dark_idx" ON "site_settings" USING btree ("logo_on_dark_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_children_order_idx" ON "navigation_header_children" USING btree ("_order");
  CREATE INDEX "navigation_header_children_parent_id_idx" ON "navigation_header_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_header_children_locales_locale_parent_id_unique" ON "navigation_header_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_header_children_locales_parent_id_idx" ON "navigation_header_children_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_header_locales_locale_parent_id_unique" ON "navigation_header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_header_locales_parent_id_idx" ON "navigation_header_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_links_locales_locale_parent_id_unique" ON "navigation_footer_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_links_locales_parent_id_idx" ON "navigation_footer_links_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_order_idx" ON "navigation_footer" USING btree ("_order");
  CREATE INDEX "navigation_footer_parent_id_idx" ON "navigation_footer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_locales_locale_parent_id_unique" ON "navigation_footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_locales_parent_id_idx" ON "navigation_footer_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_locales_parent_id_idx" ON "navigation_locales" USING btree ("_parent_id");
  CREATE INDEX "calculator_rates_order_idx" ON "calculator_rates" USING btree ("_order");
  CREATE INDEX "calculator_rates_parent_id_idx" ON "calculator_rates" USING btree ("_parent_id");
  CREATE INDEX "calculator_benchmarks_order_idx" ON "calculator_benchmarks" USING btree ("_order");
  CREATE INDEX "calculator_benchmarks_parent_id_idx" ON "calculator_benchmarks" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "calculator_benchmarks_locales_locale_parent_id_unique" ON "calculator_benchmarks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "calculator_benchmarks_locales_parent_id_idx" ON "calculator_benchmarks_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "calculator_locales_locale_parent_id_unique" ON "calculator_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "calculator_locales_parent_id_idx" ON "calculator_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "universities_highlights" CASCADE;
  DROP TABLE "universities_highlights_locales" CASCADE;
  DROP TABLE "universities_languages" CASCADE;
  DROP TABLE "universities_admission_channels" CASCADE;
  DROP TABLE "universities" CASCADE;
  DROP TABLE "universities_locales" CASCADE;
  DROP TABLE "programs_career_outcomes" CASCADE;
  DROP TABLE "programs_career_outcomes_locales" CASCADE;
  DROP TABLE "programs_requirements" CASCADE;
  DROP TABLE "programs_requirements_locales" CASCADE;
  DROP TABLE "programs_languages" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "programs_locales" CASCADE;
  DROP TABLE "cities_highlights" CASCADE;
  DROP TABLE "cities_highlights_locales" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "cities_locales" CASCADE;
  DROP TABLE "disciplines" CASCADE;
  DROP TABLE "disciplines_locales" CASCADE;
  DROP TABLE "scholarships_levels" CASCADE;
  DROP TABLE "scholarships" CASCADE;
  DROP TABLE "scholarships_locales" CASCADE;
  DROP TABLE "scholarships_rels" CASCADE;
  DROP TABLE "services_features" CASCADE;
  DROP TABLE "services_features_locales" CASCADE;
  DROP TABLE "services_steps" CASCADE;
  DROP TABLE "services_steps_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "packages_features" CASCADE;
  DROP TABLE "packages_features_locales" CASCADE;
  DROP TABLE "packages" CASCADE;
  DROP TABLE "packages_locales" CASCADE;
  DROP TABLE "pages_blocks_hero_chips" CASCADE;
  DROP TABLE "pages_blocks_hero_chips_locales" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_audiences_items" CASCADE;
  DROP TABLE "pages_blocks_audiences_items_locales" CASCADE;
  DROP TABLE "pages_blocks_audiences" CASCADE;
  DROP TABLE "pages_blocks_audiences_locales" CASCADE;
  DROP TABLE "pages_blocks_services_grid" CASCADE;
  DROP TABLE "pages_blocks_services_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_universities_showcase" CASCADE;
  DROP TABLE "pages_blocks_universities_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_cities_showcase" CASCADE;
  DROP TABLE "pages_blocks_cities_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_process_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_process_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_cost_comparison" CASCADE;
  DROP TABLE "pages_blocks_cost_comparison_locales" CASCADE;
  DROP TABLE "pages_blocks_comparison_rows" CASCADE;
  DROP TABLE "pages_blocks_comparison_rows_locales" CASCADE;
  DROP TABLE "pages_blocks_comparison" CASCADE;
  DROP TABLE "pages_blocks_comparison_locales" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_posts_feed" CASCADE;
  DROP TABLE "pages_blocks_posts_feed_locales" CASCADE;
  DROP TABLE "pages_blocks_program_search" CASCADE;
  DROP TABLE "pages_blocks_program_search_locales" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_rich_text_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "pages_blocks_newsletter_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_chips" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_chips_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_audiences_items" CASCADE;
  DROP TABLE "_pages_v_blocks_audiences_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_audiences" CASCADE;
  DROP TABLE "_pages_v_blocks_audiences_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_universities_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_universities_showcase_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cities_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_cities_showcase_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cost_comparison" CASCADE;
  DROP TABLE "_pages_v_blocks_cost_comparison_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_rows_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_posts_feed" CASCADE;
  DROP TABLE "_pages_v_blocks_posts_feed_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_program_search" CASCADE;
  DROP TABLE "_pages_v_blocks_program_search_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "applications_services" CASCADE;
  DROP TABLE "applications_notes" CASCADE;
  DROP TABLE "applications_status_history" CASCADE;
  DROP TABLE "applications" CASCADE;
  DROP TABLE "applications_rels" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "analytics_events" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_locales" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings_stats_locales" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_header_children" CASCADE;
  DROP TABLE "navigation_header_children_locales" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_header_locales" CASCADE;
  DROP TABLE "navigation_footer_links" CASCADE;
  DROP TABLE "navigation_footer_links_locales" CASCADE;
  DROP TABLE "navigation_footer" CASCADE;
  DROP TABLE "navigation_footer_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "calculator_rates" CASCADE;
  DROP TABLE "calculator_benchmarks" CASCADE;
  DROP TABLE "calculator_benchmarks_locales" CASCADE;
  DROP TABLE "calculator" CASCADE;
  DROP TABLE "calculator_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_universities_languages";
  DROP TYPE "public"."enum_universities_admission_channels";
  DROP TYPE "public"."enum_universities_type";
  DROP TYPE "public"."enum_programs_languages";
  DROP TYPE "public"."enum_programs_level";
  DROP TYPE "public"."enum_programs_study_mode";
  DROP TYPE "public"."enum_cities_art_variant";
  DROP TYPE "public"."enum_disciplines_icon";
  DROP TYPE "public"."enum_scholarships_levels";
  DROP TYPE "public"."enum_services_currency";
  DROP TYPE "public"."enum_services_service_key";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_packages_currency";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_audiences_items_icon";
  DROP TYPE "public"."enum_pages_blocks_faq_category";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_audiences_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_faq_category";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_testimonials_country";
  DROP TYPE "public"."enum_applications_services";
  DROP TYPE "public"."enum_applications_status_history_status";
  DROP TYPE "public"."enum_applications_nationality";
  DROP TYPE "public"."enum_applications_residence";
  DROP TYPE "public"."enum_applications_applicant_type";
  DROP TYPE "public"."enum_applications_level";
  DROP TYPE "public"."enum_applications_teaching_language";
  DROP TYPE "public"."enum_applications_french_level";
  DROP TYPE "public"."enum_applications_english_level";
  DROP TYPE "public"."enum_applications_budget";
  DROP TYPE "public"."enum_applications_locale";
  DROP TYPE "public"."enum_applications_status";
  DROP TYPE "public"."enum_applications_priority";
  DROP TYPE "public"."enum_inquiries_country";
  DROP TYPE "public"."enum_inquiries_preferred_channel";
  DROP TYPE "public"."enum_inquiries_preferred_time";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_locale";
  DROP TYPE "public"."enum_subscribers_locale";
  DROP TYPE "public"."enum_subscribers_status";
  DROP TYPE "public"."enum_analytics_events_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum_calculator_rates_currency";
  DROP TYPE "public"."enum_calculator_benchmarks_currency";`)
}
