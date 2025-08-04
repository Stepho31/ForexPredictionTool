'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card p-6 text-center group"
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-700 mb-6 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}