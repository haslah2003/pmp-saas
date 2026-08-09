'use client';

/**
 * Consent-gated marketing analytics for PMPeco.
 *
 * Loads GA4, Google Ads, Meta Pixel, and the LinkedIn Insight Tag — but ONLY:
 *   1. when the corresponding NEXT_PUBLIC_* env var is set (so the whole thing
 *      is inert until you actually configure IDs in Vercel), and
 *   2. after the visitor grants consent via the bilingual banner (UK/EU-safe).
 *
 * Google uses Consent Mode v2: gtag loads with consent defaulted to "denied",
 * then flips to "granted" on Accept (enables modeled conversions). Meta and
 * LinkedIn are not loaded at all until consent is granted.
 *
 * Env vars (all optional — set only the ones you use):
 *   NEXT_PUBLIC_GA4_ID            e.g. G-XXXXXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_ID     e.g. AW-XXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID     e.g. 1234567890123456
 *   NEXT_PUBLIC_LINKEDIN_PARTNER_ID  e.g. 1234567
 */

import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const LI_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

const HAS_GOOGLE = Boolean(GA_ID || ADS_ID);
const HAS_ANY_TAG = Boolean(GA_ID || ADS_ID || META_ID || LI_ID);

const CONSENT_COOKIE = 'pmp_consent';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

type Consent = 'granted' | 'denied';

// ── bilingual banner copy ──────────────────────────────────────────────────
const COPY = {
  en: {
    text: 'We use cookies to measure traffic and improve your PMP prep experience. Marketing cookies are used only if you accept.',
    accept: 'Accept',
    decline: 'Decline',
    privacy: 'Privacy Policy',
  },
  ar: {
    text: 'نستخدم ملفات تعريف الارتباط لقياس الزيارات وتحسين تجربتك في التحضير لاختبار PMP. لا تُستخدم ملفات التسويق إلا إذا وافقت.',
    accept: 'موافق',
    decline: 'رفض',
    privacy: 'سياسة الخصوصية',
  },
};

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function detectLocale(): 'en' | 'ar' {
  const c = readCookie('pmp_locale') || readCookie('lang');
  return c === 'ar' ? 'ar' : 'en';
}

// window typings for the ad libs
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
  }
}

export default function MarketingAnalytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [locale, setLocale] = useState<'en' | 'ar'>('en');

  // Read stored consent on mount.
  useEffect(() => {
    const stored = readCookie(CONSENT_COOKIE);
    if (stored === 'granted' || stored === 'denied') setConsent(stored);
    setLocale(detectLocale());
    setReady(true);
  }, []);

  const persist = useCallback((value: Consent) => {
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
    setConsent(value);
    // Update Google Consent Mode live (no reload needed).
    if (HAS_GOOGLE && window.gtag) {
      const g = value === 'granted' ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        ad_storage: g,
        ad_user_data: g,
        ad_personalization: g,
        analytics_storage: g,
      });
    }
  }, []);

  if (!HAS_ANY_TAG || !ready) return null;

  const grantedNow = consent === 'granted';
  const L = COPY[locale];
  const isAr = locale === 'ar';

  return (
    <>
      {/* ── Google (GA4 + Ads) with Consent Mode v2 ─────────────────────── */}
      {HAS_GOOGLE && (
        <>
          <Script id="gtag-consent-default" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: '${grantedNow ? 'granted' : 'denied'}',
                ad_user_data: '${grantedNow ? 'granted' : 'denied'}',
                ad_personalization: '${grantedNow ? 'granted' : 'denied'}',
                analytics_storage: '${grantedNow ? 'granted' : 'denied'}',
                wait_for_update: 500
              });
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ''}
              ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
            `}
          </Script>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || ADS_ID}`}
          />
        </>
      )}

      {/* ── Meta Pixel (only after consent) ─────────────────────────────── */}
      {META_ID && grantedNow && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ── LinkedIn Insight Tag (only after consent) ───────────────────── */}
      {LI_ID && grantedNow && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "${LI_ID}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      )}

      {/* ── Consent banner (only when a choice hasn't been made) ─────────── */}
      {consent === null && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          role="dialog"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#1A1430',
            color: '#fff',
            padding: '16px clamp(16px, 4vw, 40px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: 0, flex: '1 1 320px', color: 'rgba(255,255,255,0.85)' }}>
            {L.text}{' '}
            <a href="/privacy" style={{ color: '#1AB0A2', textDecoration: 'underline' }}>
              {L.privacy}
            </a>
          </p>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => persist('denied')}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 8,
                padding: '9px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {L.decline}
            </button>
            <button
              onClick={() => persist('granted')}
              style={{
                background: '#1AB0A2',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '9px 22px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {L.accept}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
