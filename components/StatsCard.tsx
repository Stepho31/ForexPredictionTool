'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string
  icon: LucideIcon
}

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4">
        <Icon className="w-8 h-8 text-primary-400" />
      </div>
      
      <div className="text-3xl font-bold mb-2 gradient-text">{value}</div>
      <p className="text-gray-400">{label}</p>
    </motion.div>
  )
}