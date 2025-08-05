import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SubscriptionProvider } from '@/components/providers/SubscriptionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TradingSignals Pro - AI-Powered Trading Signals',
  description: 'Get real-time trading signals powered by AI. Join thousands of traders making informed decisions with our advanced prediction engine.',
  keywords: 'trading signals, forex, crypto, AI trading, trading predictions, buy sell signals',
  authors: [{ name: 'TradingSignals Pro' }],
  openGraph: {
    title: 'TradingSignals Pro - AI-Powered Trading Signals',
    description: 'Get real-time trading signals powered by AI. Join thousands of traders making informed decisions.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SubscriptionProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  border: '1px solid #334155',
                },
              }}
            />
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}