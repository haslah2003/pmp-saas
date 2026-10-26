'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'

type Choice = 'all' | 'essential'
const KEY = 'sim-consent'

/**
 * Our own analytics are cookieless, so the banner only appears when marketing
 * tags (GA4 / Meta Pixel) are configured, and those load only after consent.
 */
export function ConsentBanner({
  ga4Id,
  metaPixelId,
  text,
  accept,
  reject,
  policy,
  policyHref,
}: {
  ga4Id?: string | null
  metaPixelId?: string | null
  text: string
  accept: string
  reject: string
  policy: string
  policyHref: string
}) {
  const [choice, setChoice] = useState<Choice | null | 'unknown'>('unknown')
  const needed = Boolean(ga4Id || metaPixelId)

  useEffect(() => {
    try {
      setChoice((localStorage.getItem(KEY) as Choice | null) ?? null)
    } catch {
      setChoice(null)
    }
  }, [])

  const decide = (value: Choice) => {
    try {
      localStorage.setItem(KEY, value)
    } catch {}
    setChoice(value)
  }

  if (!needed) return null

  return (
    <>
      {choice === 'all' && ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(ga4Id)});`}
          </Script>
        </>
      )}
      {choice === 'all' && metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaPixelId)});fbq('track','PageView');`}
        </Script>
      )}
      {choice === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={policy}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-3xl border border-line bg-surface/95 p-5 shadow-lift backdrop-blur md:bottom-6"
        >
          <p className="text-sm leading-relaxed text-ink/85">
            {text}{' '}
            <Link href={policyHref} className="font-semibold text-primary underline underline-offset-2">
              {policy}
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => decide('essential')} className="h-10 rounded-full border border-line px-4 text-sm font-semibold hover:bg-ink/5">
              {reject}
            </button>
            <button type="button" onClick={() => decide('all')} className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-700">
              {accept}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
