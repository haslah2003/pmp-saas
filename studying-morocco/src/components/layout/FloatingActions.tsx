'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { SocialIcon } from '@/components/ui/SocialIcon'
import { buttonClass } from '@/components/ui/Button'
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
          className="group fixed end-5 bottom-5 z-40 hidden size-14 items-center justify-center rounded-full bg-primary text-white shadow-card ring-2 ring-white md:inline-flex"
        >
          <SocialIcon name="whatsapp" className="size-7" />
          <span className="pointer-events-none absolute end-full me-3 hidden rounded-control bg-primary px-3 py-1.5 text-small font-medium whitespace-nowrap text-white group-hover:block group-focus-visible:block">
            {whatsappLabel}
          </span>
        </a>
      )}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-3 pt-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden',
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
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-primary text-white"
            >
              <SocialIcon name="whatsapp" className="size-6" />
            </a>
          )}
          <Link href={consultHref} className={buttonClass('secondary', 'md', 'flex-1 px-2', true)}>
            {consultLabel}
          </Link>
          <Link href={applyHref} className={buttonClass('primary', 'md', 'flex-1 px-2', true)}>
            {applyLabel}
          </Link>
        </div>
      </div>
    </>
  )
}
