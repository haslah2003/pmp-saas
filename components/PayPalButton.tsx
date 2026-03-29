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
      Buttons: (config: unknown) => { render: (selector: string) => void }
    }
  }
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
  const buttonRendered = useRef(false)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setError('PayPal is not configured.')
      return
    }

    const existingScript = document.getElementById('paypal-sdk')
    if (existingScript) {
      setLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`
    script.async = true
    script.onload = () => setLoaded(true)
    script.onerror = () => setError('Failed to load PayPal SDK.')
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!loaded || !window.paypal || !containerRef.current || buttonRendered.current) return
    buttonRendered.current = true

    // Clear any previous buttons
    if (containerRef.current) containerRef.current.innerHTML = ''

    window.paypal
      .Buttons({
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
              body: JSON.stringify({ orderId: data.orderID }),
            })
            const result = await res.json()
            if (!result.success) throw new Error(result.error || 'Capture failed')

            // Redirect to success page with details
            const params = new URLSearchParams({
              plan: result.plan,
              period: result.period,
              amount: result.amount,
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
      .render(`#paypal-container-${planId}-${period}`)
  }, [loaded, planId, period, router])

  return (
    <div className="w-full">
      {processing && (
        <div className="flex items-center justify-center gap-2 py-3 mb-2">
          <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Processing payment...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-2">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {!loaded && !error && (
        <div className="h-12 bg-gray-100 rounded-full animate-pulse flex items-center justify-center">
          <span className="text-xs text-gray-400">Loading PayPal...</span>
        </div>
      )}

      <div
        id={`paypal-container-${planId}-${period}`}
        ref={containerRef}
        className={!loaded ? 'hidden' : ''}
      />

      <p className="text-[10px] text-gray-400 text-center mt-2">
        🔒 Secured by PayPal · Cancel anytime
      </p>
    </div>
  )
}