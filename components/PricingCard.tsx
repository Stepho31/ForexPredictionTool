'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { useSubscription } from './providers/SubscriptionProvider'
import { useAuth } from './providers/AuthProvider'
import Link from 'next/link'

interface PricingCardProps {
  tier: string
  price: string
  period: string
  features: string[]
  buttonText: string
  buttonVariant: 'primary' | 'secondary'
  popular?: boolean
}

const priceIds = {
  'Pro': 'price_pro_monthly',
  'Elite': 'price_elite_monthly'
}

export function PricingCard({ 
  tier, 
  price, 
  period, 
  features, 
  buttonText, 
  buttonVariant, 
  popular = false 
}: PricingCardProps) {
  const { createCheckoutSession, loading } = useSubscription()
  const { user, userRole } = useAuth()

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to signup if not logged in
      return
    }

    if (tier === 'Free') {
      return
    }

    try {
      const priceId = priceIds[tier as keyof typeof priceIds]
      if (priceId) {
        await createCheckoutSession(priceId)
      }
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }

  const isCurrentPlan = userRole === tier.toLowerCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative card p-8 ${popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{tier}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold">{price}</span>
          {period !== 'forever' && (
            <span className="text-gray-400 ml-1">/{period}</span>
          )}
        </div>
        {isCurrentPlan && (
          <div className="text-primary-400 text-sm font-medium">
            Current Plan
          </div>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success-400 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {tier === 'Free' ? (
          <Link 
            href={user ? '/dashboard' : '/signup'}
            className={`w-full btn-${buttonVariant} text-center block`}
          >
            {buttonText}
          </Link>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading || isCurrentPlan}
            className={`w-full btn-${buttonVariant} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : buttonText}
          </button>
        )}
      </div>
    </motion.div>
  )
}