-- Let administrators hide the landing-page hero image without discarding its URL.
ALTER TABLE public.branding_config
  ADD COLUMN IF NOT EXISTS landing_hero_image_visible boolean NOT NULL DEFAULT true;
