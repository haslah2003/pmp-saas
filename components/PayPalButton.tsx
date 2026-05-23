'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PlanId, Period } from '@/lib/plans'

interface PayPalButtonProps {
  planId: PlanId
  period: Period
  amount: number
  planName: string
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: unknown) => {
        render: (selector: string) => Promise<void> | void
      }
    }
  }
}

function waitForPayPal(timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()

    const tick = () => {
      if (window.paypal) {
        resolve()
        return
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error('PayPal SDK loaded slowly or was blocked by the browser.'))
        return
      }

      window.setTimeout(tick, 150)
    }

    tick()
  })
}

export default function PayPalButton({
  planId,
  period,
  amount,
  planName,
}: PayPalButtonProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  const containerId = `paypal-container-${planId}-${period}`

  useEffect(() => {
    let cancelled = false

    async function loadSdk() {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

      if (!clientId) {
        setError('PayPal is not configured.')
        return
      }

      if (window.paypal) {
        setLoaded(true)
        return
      }

      const existingScript = document.getElementById('paypal-sdk')

      if (existingScript) {
        try {
          await waitForPayPal()
          if (!cancelled) setLoaded(true)
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'PayPal could not load.')
          }
        }
        return
      }

      const script = document.createElement('script')
      script.id = 'paypal-sdk'
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        clientId
      )}&currency=USD&intent=capture&components=buttons`
      script.async = true

      script.onload = () => {
        if (!cancelled) setLoaded(true)
      }

      script.onerror = () => {
        if (!cancelled) setError('Failed to load PayPal SDK.')
      }

      document.body.appendChild(script)
    }

    loadSdk()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!loaded || !window.paypal || !containerRef.current) return

    let cancelled = false
    setError('')
    containerRef.current.innerHTML = ''

    try {
      const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'pay',
          height: 48,
        },

        createOrder: async () => {
          setProcessing(true)
          setError('')

          try {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ planId, period }),
            })

            const data = await res.json()
            if (!data.orderId) throw new Error(data.error || 'Failed to create order')

            return data.orderId
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Something went wrong'
            setError(msg)
            setProcessing(false)
            throw err
          }
        },

        onApprove: async (data: { orderID: string }) => {
          setProcessing(true)

          try {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID, planId, period }),
            })

            const result = await res.json()
            if (!result.success) throw new Error(result.error || 'Capture failed')

            const params = new URLSearchParams({
              plan: result.plan,
              period: result.period,
              amount: result.amount,
              ...(result.receiptId ? { receiptId: result.receiptId } : {}),
            })

            router.push(`/dashboard/payment/success?${params.toString()}`)
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Payment failed'
            setError(msg)
            setProcessing(false)
          }
        },

        onCancel: () => {
          setProcessing(false)
          setError('')
        },

        onError: (err: unknown) => {
          console.error('PayPal error:', err)
          setError('Payment failed. Please try again.')
          setProcessing(false)
        },
      })

      const renderResult = buttons.render(`#${containerId}`)

      if (renderResult && typeof renderResult.then === 'function') {
        renderResult.catch((err) => {
          if (!cancelled) {
            console.error('PayPal render error:', err)
            setError('PayPal button could not render. Refresh the page and try again.')
          }
        })
      }
    } catch (err) {
      console.error('PayPal button setup error:', err)
      setError('PayPal button could not start. Refresh the page and try again.')
    }

    return () => {
      cancelled = true
    }
  }, [loaded, planId, period, router, containerId])

  return (
    <div className="w-full">
      <div className="text-[11px] text-gray-400 mb-2 text-center">
        Pay securely with PayPal — {planName} · ${amount}
      </div>

      {processing && (
        <div className="flex items-center justify-center gap-2 py-3 mb-2">
          <div className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Processing payment...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-2">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {!loaded && !error && (
        <div className="h-12 bg-gray-100 rounded-full animate-pulse flex items-center justify-center mb-2">
          <span className="text-xs text-gray-400">Loading PayPal checkout...</span>
        </div>
      )}

      <div
        id={containerId}
        ref={containerRef}
        className={!loaded ? 'hidden' : ''}
      />

      <p className="text-[10px] text-gray-400 text-center mt-2">
        🔒 Secured by PayPal · Instant access after payment
      </p>
    </div>
  )
}
