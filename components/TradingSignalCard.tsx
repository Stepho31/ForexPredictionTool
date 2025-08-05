'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Clock, Target, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

interface TradingSignalCardProps {
  signal: TradingSignal
}

export function TradingSignalCard({ signal }: TradingSignalCardProps) {
  const getSignalIcon = () => {
    switch (signal.signal) {
      case 'BUY':
        return <TrendingUp className="w-5 h-5 text-success-400" />
      case 'SELL':
        return <TrendingDown className="w-5 h-5 text-danger-400" />
      case 'HOLD':
        return <Minus className="w-5 h-5 text-yellow-400" />
      default:
        return <Minus className="w-5 h-5 text-gray-400" />
    }
  }

  const getSignalClass = () => {
    switch (signal.signal) {
      case 'BUY':
        return 'signal-buy'
      case 'SELL':
        return 'signal-sell'
      case 'HOLD':
        return 'signal-hold'
      default:
        return 'bg-dark-700 border-dark-600'
    }
  }

  const getConfidenceColor = () => {
    if (signal.confidence >= 80) return 'text-success-400'
    if (signal.confidence >= 60) return 'text-yellow-400'
    return 'text-danger-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 border ${getSignalClass()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getSignalIcon()}
          <div>
            <h3 className="font-semibold text-lg">{signal.pair}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(signal.timestamp, { addSuffix: true })}
              <span className="text-xs bg-dark-600 px-2 py-1 rounded">
                {signal.timeframe}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${getConfidenceColor()}`}>
            {signal.confidence}%
          </div>
          <div className="text-sm text-gray-400">Confidence</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-dark-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Entry Price</div>
          <div className="font-semibold">{signal.entryPrice.toFixed(4)}</div>
        </div>
        
        <div className="bg-success-500/10 border border-success-500/20 rounded-lg p-3">
          <div className="text-sm text-success-400 mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" />
            Take Profit
          </div>
          <div className="font-semibold text-success-400">
            {signal.takeProfit.toFixed(4)}
          </div>
        </div>
        
        <div className="bg-danger-500/10 border border-danger-500/20 rounded-lg p-3">
          <div className="text-sm text-danger-400 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Stop Loss
          </div>
          <div className="font-semibold text-danger-400">
            {signal.stopLoss.toFixed(4)}
          </div>
        </div>
      </div>

      <div className="bg-dark-700/30 rounded-lg p-3">
        <div className="text-sm text-gray-400 mb-2">AI Reasoning</div>
        <p className="text-sm leading-relaxed">{signal.reasoning}</p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-600">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            signal.signal === 'BUY' ? 'bg-success-400' : 
            signal.signal === 'SELL' ? 'bg-danger-400' : 'bg-yellow-400'
          }`} />
          <span className="text-sm font-medium">
            {signal.signal} {signal.pair}
          </span>
        </div>
        
        <button className="btn-primary text-sm px-4 py-2">
          View Chart
        </button>
      </div>
    </motion.div>
  )
}