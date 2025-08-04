'use client'

import { motion } from 'framer-motion'
import { Crown, Zap, BarChart3, Clock, Target, TrendingUp } from 'lucide-react'

interface UserStatsProps {
  userRole: 'free' | 'pro' | 'elite' | null
}

export function UserStats({ userRole }: UserStatsProps) {
  const getRoleDisplay = () => {
    switch (userRole) {
      case 'free':
        return { name: 'Free', color: 'text-gray-400', icon: Clock }
      case 'pro':
        return { name: 'Pro', color: 'text-primary-400', icon: Zap }
      case 'elite':
        return { name: 'Elite', color: 'text-yellow-400', icon: Crown }
      default:
        return { name: 'Free', color: 'text-gray-400', icon: Clock }
    }
  }

  const getUsageStats = () => {
    switch (userRole) {
      case 'free':
        return {
          used: 2,
          total: 2,
          percentage: 100,
          remaining: 0
        }
      case 'pro':
        return {
          used: 45,
          total: 1000,
          percentage: 4.5,
          remaining: 955
        }
      case 'elite':
        return {
          used: 156,
          total: 10000,
          percentage: 1.56,
          remaining: 9844
        }
      default:
        return {
          used: 0,
          total: 2,
          percentage: 0,
          remaining: 2
        }
    }
  }

  const roleInfo = getRoleDisplay()
  const usageStats = getUsageStats()
  const IconComponent = roleInfo.icon

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Subscription Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-dark-700`}>
            <IconComponent className={`w-6 h-6 ${roleInfo.color}`} />
          </div>
          <div>
            <h3 className="font-semibold">Subscription</h3>
            <p className={`text-sm ${roleInfo.color}`}>{roleInfo.name} Plan</p>
          </div>
        </div>
        
        {userRole === 'free' && (
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3">
            <p className="text-sm text-primary-400 font-medium">Upgrade for more features</p>
            <a href="/pricing" className="btn-primary text-xs mt-2 inline-block">
              View Plans
            </a>
          </div>
        )}
      </motion.div>

      {/* Predictions Used */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-dark-700">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold">Predictions</h3>
            <p className="text-sm text-gray-400">Used Today</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Used</span>
            <span className="font-medium">{usageStats.used}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Remaining</span>
            <span className="font-medium">{usageStats.remaining}</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(usageStats.percentage, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Success Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-dark-700">
            <TrendingUp className="w-6 h-6 text-success-400" />
          </div>
          <div>
            <h3 className="font-semibold">Success Rate</h3>
            <p className="text-sm text-gray-400">Last 30 Days</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-success-400 mb-2">78%</div>
          <div className="text-sm text-gray-400">
            {userRole === 'free' ? 'Limited data' : 'Based on 156 trades'}
          </div>
        </div>
      </motion.div>

      {/* Next Signal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-dark-700">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">Next Signal</h3>
            <p className="text-sm text-gray-400">Estimated</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold mb-1">
            {userRole === 'free' ? '2 hours' : '15 min'}
          </div>
          <div className="text-sm text-gray-400">
            {userRole === 'free' ? 'Free tier limit' : 'Real-time updates'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}