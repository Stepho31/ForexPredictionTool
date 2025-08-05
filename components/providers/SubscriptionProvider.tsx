'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from './AuthProvider'

interface SubscriptionContextType {
  createCheckoutSession: (priceId: string) => Promise<void>
  createPortalSession: () => Promise<void>
  loading: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const createCheckoutSession = async (priceId: string) => {
    if (!user) {
      throw new Error('You must be logged in to subscribe')
    }

    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          email: user.email,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw new Error(error.message)
        }
      }
    } catch (error: any) {
      throw new Error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const createPortalSession = async () => {
    if (!user) {
      throw new Error('You must be logged in to manage your subscription')
    }

    setLoading(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      throw new Error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    createCheckoutSession,
    createPortalSession,
    loading,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}