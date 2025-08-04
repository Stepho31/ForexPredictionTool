'use client'

import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, Users, BarChart3, Bell, Shield } from 'lucide-react'
import { PricingCard } from '@/components/PricingCard'
import { useAuth } from '@/components/providers/AuthProvider'

export default function PricingPage() {
  const { user, userRole } = useAuth()

  const features = [
    {
      name: 'Daily Predictions',
      free: '2',
      pro: 'Unlimited',
      elite: 'Unlimited'
    },
    {
      name: 'Currency Pairs',
      free: '5',
      pro: '25+',
      elite: '25+'
    },
    {
      name: 'Real-time Alerts',
      free: false,
      pro: true,
      elite: true
    },
    {
      name: 'Advanced Charts',
      free: false,
      pro: true,
      elite: true
    },
    {
      name: 'Risk Management',
      free: false,
      pro: true,
      elite: true
    },
    {
      name: 'Discord Community',
      free: false,
      pro: true,
      elite: true
    },
    {
      name: 'Priority Support',
      free: false,
      pro: false,
      elite: true
    },
    {
      name: 'Custom Filters',
      free: false,
      pro: false,
      elite: true
    },
    {
      name: 'Weekly Strategy Calls',
      free: false,
      pro: false,
      elite: true
    },
    {
      name: 'Dedicated Account Manager',
      free: false,
      pro: false,
      elite: true
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast Signals',
      description: 'Get trading signals in real-time with ultra-low latency delivery.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Professional-grade charts with technical indicators and AI insights.'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Built-in stop-loss and take-profit levels with position sizing.'
    },
    {
      icon: Users,
      title: 'Community Access',
      description: 'Join our exclusive Discord community for strategy discussions.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get alerts for new signals, entry points, and market opportunities.'
    },
    {
      icon: Crown,
      title: 'Premium Support',
      description: 'Priority support and dedicated account management for Elite users.'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900/20 to-purple-900/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Choose Your <span className="gradient-text">Trading Plan</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade when you're ready to unlock premium features. 
              Join thousands of traders making informed decisions with our AI-powered signals.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              tier="Free"
              price="$0"
              period="forever"
              features={[
                '2 daily predictions',
                'Basic chart view',
                'Limited currency pairs',
                'Community access'
              ]}
              buttonText="Get Started"
              buttonVariant="secondary"
              popular={false}
            />
            <PricingCard
              tier="Pro"
              price="$19"
              period="month"
              features={[
                'Unlimited predictions',
                'Real-time alerts',
                'All currency pairs',
                'Advanced charts',
                'Risk management tools',
                'Priority support'
              ]}
              buttonText="Start Pro Trial"
              buttonVariant="primary"
              popular={true}
            />
            <PricingCard
              tier="Elite"
              price="$49"
              period="month"
              features={[
                'Everything in Pro',
                'Custom filters',
                'Discord VIP access',
                'Weekly strategy calls',
                'Advanced analytics',
                'Dedicated account manager'
              ]}
              buttonText="Go Elite"
              buttonVariant="primary"
              popular={false}
            />
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-xl text-gray-300">
              See exactly what each plan includes
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-primary-400">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-yellow-400">Elite</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature.name} className="border-b border-dark-700">
                    <td className="py-4 px-6 font-medium">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-success-400 mx-auto" />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )
                      ) : (
                        <span className="font-medium">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-success-400 mx-auto" />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )
                      ) : (
                        <span className="font-medium text-primary-400">{feature.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.elite === 'boolean' ? (
                        feature.elite ? (
                          <Check className="w-5 h-5 text-success-400 mx-auto" />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )
                      ) : (
                        <span className="font-medium text-yellow-400">{feature.elite}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TradingSignals Pro?</h2>
            <p className="text-xl text-gray-300">
              Our platform combines cutting-edge AI technology with proven trading strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-6">
                  <benefit.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who are already making better decisions with AI-powered signals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="btn-primary text-lg px-8 py-4">
              Start Free Trial
            </a>
            <a href="/dashboard" className="btn-secondary text-lg px-8 py-4">
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}