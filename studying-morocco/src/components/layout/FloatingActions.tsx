'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { SocialIcon } from '@/components/ui/SocialIcon'
import { cn } from '@/lib/utils'

import { trackEvent } from './Tracker'

/** WhatsApp bubble (desktop) and a sticky action bar (mobile) that appears after scrolling. */
export function FloatingActions({
  whatsappHref,
  whatsappLabel,
  applyHref,
  applyLabel,
  consultHref,
  consultLabel,
}: {
  whatsappHref: string | null
  whatsappLabel: string
  applyHref: string
  applyLabel: string
  consultHref: string
  consultLabel: string
}) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappLabel}
          onClick={() => trackEvent('whatsapp_click')}
          className="group fixed end-5 bottom-5 z-40 hidden size-14 items-center justify-center rounded-full bg-[#1f9d55] text-white shadow-lift transition hover:scale-105 md:inline-flex"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#1f9d55] opacity-25 [animation-duration:2.6s]" aria-hidden="true" />
          <SocialIcon name="whatsapp" className="relative size-7" />
          <span className="pointer-events-none absolute end-full me-3 hidden rounded-full bg-secondary px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white shadow-soft group-hover:block">
            {whatsappLabel}
          </span>
        </a>
      )}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 px-3 pt-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden',
          show ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex gap-2">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsappLabel}
              onClick={() => trackEvent('whatsapp_click')}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[#1f9d55] text-white"
            >
              <SocialIcon name="whatsapp" className="size-6" />
            </a>
          )}
          <Link href={consultHref} className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-line bg-surface text-sm font-semibold">
            {consultLabel}
          </Link>
          <Link href={applyHref} className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {applyLabel}
          </Link>
        </div>
      </div>
    </>
  )
}
