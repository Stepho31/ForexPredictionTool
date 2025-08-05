'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Bell, 
  Users, 
  Check,
  ArrowRight,
  Star,
  Play
} from 'lucide-react'
import Link from 'next/link'
import { PricingCard } from '@/components/PricingCard'
import { FeatureCard } from '@/components/FeatureCard'
import { TestimonialCard } from '@/components/TestimonialCard'
import { StatsCard } from '@/components/StatsCard'

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze market patterns to generate accurate trading signals.',
      color: 'text-primary-400'
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Professional-grade charts with technical indicators and real-time market data.',
      color: 'text-success-400'
    },
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Get instant notifications for new signals, entry points, and market opportunities.',
      color: 'text-yellow-400'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Built-in stop-loss and take-profit levels with position sizing recommendations.',
      color: 'text-purple-400'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Ultra-low latency signal delivery ensuring you never miss a trading opportunity.',
      color: 'text-orange-400'
    },
    {
      icon: Users,
      title: 'Community Access',
      description: 'Join our exclusive Discord community for strategy discussions and market insights.',
      color: 'text-pink-400'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Professional Trader',
      content: 'TradingSignals Pro has completely transformed my trading. The AI predictions are incredibly accurate and the real-time alerts ensure I never miss an opportunity.',
      rating: 5,
      avatar: '/avatars/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Day Trader',
      content: 'I\'ve tried many signal services, but this one stands out. The combination of AI analysis and human expertise is unbeatable.',
      rating: 5,
      avatar: '/avatars/michael.jpg'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Swing Trader',
      content: 'The risk management features are excellent. I feel much more confident in my trades knowing I have proper stop-loss levels.',
      rating: 5,
      avatar: '/avatars/emma.jpg'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Success Rate', value: '78%', icon: TrendingUp },
    { label: 'Daily Signals', value: '50+', icon: Bell },
    { label: 'Currency Pairs', value: '25+', icon: BarChart3 }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">AI-Powered</span>
                <br />
                Trading Signals
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join thousands of traders making informed decisions with our advanced prediction engine. 
                Get real-time signals with 78% accuracy rate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TradingSignals Pro?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven trading strategies to deliver exceptional results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">
              Join thousands of satisfied traders who have transformed their trading with our signals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-300">
              Start free and upgrade when you're ready to unlock premium features.
            </p>
          </div>
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Trading?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who are already making better decisions with AI-powered signals.
          </p>
          <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}