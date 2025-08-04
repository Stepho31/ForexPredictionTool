'use client'

import { motion } from 'framer-motion'
import { Crown, Zap, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export function SubscriptionBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative bg-gradient-to-r from-primary-900/20 to-purple-900/20 border border-primary-500/30 rounded-xl p-6 mb-8"
    >
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary-400" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            Unlock Premium Trading Signals
          </h3>
          <p className="text-gray-300 mb-4">
            Upgrade to Pro and get unlimited signals, real-time alerts, advanced charts, and exclusive Discord access.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Unlimited Signals</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary-400" />
                <span>Real-time Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success-400 font-medium">78% Success Rate</span>
              </div>
            </div>

            <Link 
              href="/pricing"
              className="btn-primary flex items-center gap-2"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-dark-800/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Current Plan: Free (2 signals/day)</span>
          <span className="text-primary-400 font-medium">Pro: $19/month</span>
        </div>
      </div>
    </motion.div>
  )
}