'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

export function TestimonialCard({ name, role, content, rating, avatar }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card p-6"
    >
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, index) => (
          <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      
      <p className="text-gray-300 mb-6 leading-relaxed">"{content}"</p>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}