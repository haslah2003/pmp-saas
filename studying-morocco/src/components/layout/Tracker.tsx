'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const send = (payload: Record<string, unknown>) => {
  try {
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) navigator.sendBeacon('/beacon', new Blob([body], { type: 'application/json' }))
    else void fetch('/beacon', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } })
  } catch {
    // Analytics must never break the page.
  }
}

/** Records a named conversion event (e.g. a WhatsApp click) in the admin analytics. */
export const trackEvent = (name: string) => {
  if (typeof window === 'undefined') return
  send({ type: 'event', name, path: window.location.pathname, locale: document.documentElement.lang })
}

/** Cookieless page-view tracking for the admin dashboard. */
export function Tracker({ locale }: { locale: string }) {
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    if (!pathname) return
    if (navigator.doNotTrack === '1' || /bot|crawl|spider|headless/i.test(navigator.userAgent)) return
    const params = new URLSearchParams(window.location.search)
    send({
      type: 'pageview',
      path: pathname,
      locale,
      referrer: first.current ? document.referrer : '',
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
    })
    if (first.current && params.get('utm_source')) {
      try {
        sessionStorage.setItem(
          'sim-utm',
          JSON.stringify({ utmSource: params.get('utm_source'), utmMedium: params.get('utm_medium'), utmCampaign: params.get('utm_campaign') }),
        )
      } catch {}
    }
    first.current = false
  }, [pathname, locale])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (el?.dataset.track) trackEvent(el.dataset.track)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
