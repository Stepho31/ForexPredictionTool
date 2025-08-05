'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Bell, 
  Settings, 
  User,
  Crown,
  Zap,
  Clock,
  Target
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { TradingSignalCard } from '@/components/TradingSignalCard'
import { ChartComponent } from '@/components/ChartComponent'
import { UserStats } from '@/components/UserStats'
import { SubscriptionBanner } from '@/components/SubscriptionBanner'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface TradingSignal {
  id: string
  pair: string
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  entryPrice: number
  takeProfit: number
  stopLoss: number
  timestamp: Date
  timeframe: string
  reasoning: string
}

export default function DashboardPage() {
  const { user, userRole, loading: authLoading } = useAuth()
  const [signals, setSignals] = useState<TradingSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H')

  useEffect(() => {
    if (user) {
      fetchSignals()
    }
  }, [user, userRole])

  const fetchSignals = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from your API
      const mockSignals: TradingSignal[] = [
        {
          id: '1',
          pair: 'EUR/USD',
          signal: 'BUY',
          confidence: 85,
          entryPrice: 1.0850,
          takeProfit: 1.0920,
          stopLoss: 1.0800,
          timestamp: new Date(),
          timeframe: '1H',
          reasoning: 'Strong bullish momentum with RSI oversold and MACD crossover'
        },
        {
          id: '2',
          pair: 'GBP/JPY',
          signal: 'SELL',
          confidence: 78,
          entryPrice: 185.50,
          takeProfit: 184.20,
          stopLoss: 186.80,
          timestamp: new Date(Date.now() - 3600000),
          timeframe: '4H',
          reasoning: 'Bearish divergence on RSI with price rejection at resistance'
        },
        {
          id: '3',
          pair: 'USD/JPY',
          signal: 'HOLD',
          confidence: 45,
          entryPrice: 150.20,
          takeProfit: 151.00,
          stopLoss: 149.50,
          timestamp: new Date(Date.now() - 7200000),
          timeframe: '1D',
          reasoning: 'Mixed signals - waiting for clearer direction'
        }
      ]
      
      // Filter signals based on user role
      const filteredSignals = userRole === 'free' ? mockSignals.slice(0, 2) : mockSignals
      setSignals(filteredSignals)
    } catch (error) {
      console.error('Error fetching signals:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
          <a href="/login" className="btn-primary">Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold gradient-text">Trading Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                {user.displayName || user.email}
                {userRole !== 'free' && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-secondary">
                <Bell className="w-4 h-4" />
              </button>
              <button className="btn-secondary">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Banner for Free Users */}
        {userRole === 'free' && (
          <SubscriptionBanner />
        )}

        {/* User Stats */}
        <UserStats userRole={userRole} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Trading Signals */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Latest Trading Signals</h2>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedPair}
                    onChange={(e) => setSelectedPair(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="GBP/USD">GBP/USD</option>
                    <option value="USD/JPY">USD/JPY</option>
                    <option value="AUD/USD">AUD/USD</option>
                    <option value="USD/CAD">USD/CAD</option>
                  </select>
                  <select 
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="15M">15M</option>
                    <option value="1H">1H</option>
                    <option value="4H">4H</option>
                    <option value="1D">1D</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-4">
                  {signals.map((signal, index) => (
                    <motion.div
                      key={signal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TradingSignalCard signal={signal} />
                    </motion.div>
                  ))}
                </div>
              )}

              {userRole === 'free' && signals.length >= 2 && (
                <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-400">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Upgrade to Pro</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Get unlimited signals, real-time alerts, and advanced features.
                  </p>
                  <a href="/pricing" className="btn-primary text-sm mt-3 inline-block">
                    Upgrade Now
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Live Chart</h2>
              <ChartComponent pair={selectedPair} timeframe={selectedTimeframe} />
            </div>
          </div>
        </div>

        {/* Additional Features for Pro/Elite Users */}
        {userRole !== 'free' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Risk Management</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Position Size</span>
                  <span className="font-medium">2% of account</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Max Risk per Trade</span>
                  <span className="font-medium">1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Daily Loss Limit</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="font-medium text-success-400">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg Profit</span>
                  <span className="font-medium text-success-400">+2.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="font-medium">156</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}