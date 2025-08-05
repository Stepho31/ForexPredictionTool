'use client'

import { useEffect, useRef } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts'

interface ChartComponentProps {
  pair: string
  timeframe: string
}

export function ChartComponent({ pair, timeframe }: ChartComponentProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: '#1e293b' },
        textColor: '#e2e8f0',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    })

    candlestickSeriesRef.current = candlestickSeries

    // Generate mock data
    const mockData: CandlestickData[] = generateMockData()
    candlestickSeries.setData(mockData)

    // Add EMA line
    const emaSeries = chart.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
      title: 'EMA 20',
    })

    const emaData = calculateEMA(mockData, 20)
    emaSeries.setData(emaData)

    // Add RSI
    const rsiSeries = chart.addLineSeries({
      color: '#f59e0b',
      lineWidth: 2,
      title: 'RSI',
      priceScaleId: 'right',
    })

    const rsiData = calculateRSI(mockData)
    rsiSeries.setData(rsiData)

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [pair, timeframe])

  const generateMockData = (): CandlestickData[] => {
    const data: CandlestickData[] = []
    let basePrice = 1.0850
    const now = new Date()

    for (let i = 100; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const change = (Math.random() - 0.5) * 0.01
      const open = basePrice
      const close = basePrice + change
      const high = Math.max(open, close) + Math.random() * 0.005
      const low = Math.min(open, close) - Math.random() * 0.005

      data.push({
        time: Math.floor(time.getTime() / 1000) as any,
        open,
        high,
        low,
        close,
      })

      basePrice = close
    }

    return data
  }

  const calculateEMA = (data: CandlestickData[], period: number) => {
    const emaData: { time: any; value: number }[] = []
    let ema = data[0].close

    data.forEach((candle, index) => {
      if (index === 0) {
        ema = candle.close
      } else {
        ema = (candle.close * 2 / (period + 1)) + (ema * (period - 1) / (period + 1))
      }

      emaData.push({
        time: candle.time,
        value: ema,
      })
    })

    return emaData
  }

  const calculateRSI = (data: CandlestickData[]) => {
    const rsiData: { time: any; value: number }[] = []
    const period = 14
    let gains = 0
    let losses = 0

    data.forEach((candle, index) => {
      if (index === 0) {
        rsiData.push({ time: candle.time, value: 50 })
        return
      }

      const change = candle.close - data[index - 1].close
      if (change > 0) {
        gains += change
      } else {
        losses += Math.abs(change)
      }

      if (index >= period) {
        const avgGain = gains / period
        const avgLoss = losses / period
        const rs = avgGain / avgLoss
        const rsi = 100 - (100 / (1 + rs))

        rsiData.push({ time: candle.time, value: rsi })

        // Remove oldest values
        const oldestChange = data[index - period + 1].close - data[index - period].close
        if (oldestChange > 0) {
          gains -= oldestChange
        } else {
          losses -= Math.abs(oldestChange)
        }
      } else {
        rsiData.push({ time: candle.time, value: 50 })
      }
    })

    return rsiData
  }

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{pair} Chart</h3>
        <div className="text-sm text-gray-400">{timeframe} Timeframe</div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[300px]" />
    </div>
  )
}