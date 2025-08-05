from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pandas as pd
import numpy as np
from ta.trend import PSARIndicator
from ta.trend import IchimokuIndicator
from datetime import datetime, timedelta
import plotly.graph_objects as go
import json
from functools import wraps
import os

app = Flask(__name__)
CORS(app)

# Configuration
POLYGON_API_KEY = os.getenv('POLYGON_API_KEY', 'hoEeyfMqcD7Ch779SoWBD8spANnA7TU0')

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return jsonify({'error': 'API key required'}), 401
        # Add your API key validation logic here
        return f(*args, **kwargs)
    return decorated_function

def fetch_forex_data(pair, time_frame):
    """Fetch forex data from Polygon.io"""
    ticker = f"C:{pair.replace('/', '')}"
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=7)
    
    start_timestamp = int(start_time.timestamp() * 1000)
    end_timestamp = int(end_time.timestamp() * 1000)
    
    url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/{time_frame}/minute/{start_timestamp}/{end_timestamp}?apiKey={POLYGON_API_KEY}"
    
    response = requests.get(url)
    data = response.json()
    
    if "results" in data and isinstance(data["results"], list):
        return data["results"]
    elif "error" in data:
        raise Exception(f"API Error: {data['error']}")
    else:
        raise Exception("API returned no data or unexpected format")

def calculate_rsi(prices, window=14):
    """Calculate RSI indicator"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(prices):
    """Calculate MACD indicator"""
    ema_12 = prices.ewm(span=12, adjust=False).mean()
    ema_26 = prices.ewm(span=26, adjust=False).mean()
    macd = ema_12 - ema_26
    signal = macd.ewm(span=9, adjust=False).mean()
    return macd, signal

def calculate_bollinger_bands(prices, window=20):
    """Calculate Bollinger Bands"""
    sma = prices.rolling(window=window).mean()
    std_dev = prices.rolling(window=window).std()
    upper_band = sma + (2 * std_dev)
    lower_band = sma - (2 * std_dev)
    return upper_band, lower_band

def calculate_adx(prices, high, low, window=14):
    """Calculate ADX indicator"""
    high_low = high - low
    high_close = abs(high - prices.shift(1))
    low_close = abs(low - prices.shift(1))
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    
    plus_dm = high.diff().clip(lower=0)
    minus_dm = low.diff().clip(upper=0).abs()
    
    atr = tr.rolling(window=window).mean()
    plus_di = 100 * (plus_dm.rolling(window=window).mean() / atr)
    minus_di = 100 * (minus_dm.rolling(window=window).mean() / atr)
    
    dx = (abs(plus_di - minus_di) / (plus_di + minus_di)) * 100
    adx = dx.rolling(window=window).mean()
    
    return adx, plus_di, minus_di

def predict_trend(data):
    """Generate trading prediction based on technical analysis"""
    prices = pd.Series([item['c'] for item in data])
    high = pd.Series([item['h'] for item in data])
    low = pd.Series([item['l'] for item in data])
    
    # Use last 100 data points
    prices = prices[-100:]
    high = high[-100:]
    low = low[-100:]
    
    current_price = prices.iloc[-1]
    pip_size = 0.0001
    
    # Calculate indicators
    rsi = calculate_rsi(prices).iloc[-1]
    macd, signal = calculate_macd(prices)
    macd_last = macd.iloc[-1]
    signal_last = signal.iloc[-1]
    adx, plus_di, minus_di = calculate_adx(prices, high, low)
    momentum = prices.diff(periods=10).iloc[-1]
    upper_band, lower_band = calculate_bollinger_bands(prices)
    
    # Determine signal and confidence
    signal_strength = 0
    signal_type = 'HOLD'
    
    # RSI analysis
    if rsi < 30:
        signal_strength += 20
        signal_type = 'BUY'
    elif rsi > 70:
        signal_strength += 20
        signal_type = 'SELL'
    
    # MACD analysis
    if macd_last > signal_last and momentum > 0:
        signal_strength += 25
        if signal_type == 'HOLD':
            signal_type = 'BUY'
    elif macd_last < signal_last and momentum < 0:
        signal_strength += 25
        if signal_type == 'HOLD':
            signal_type = 'SELL'
    
    # Bollinger Bands analysis
    if current_price < lower_band.iloc[-1]:
        signal_strength += 15
        if signal_type == 'HOLD':
            signal_type = 'BUY'
    elif current_price > upper_band.iloc[-1]:
        signal_strength += 15
        if signal_type == 'HOLD':
            signal_type = 'SELL'
    
    # ADX analysis
    adx_value = adx.iloc[-1]
    if adx_value > 25:
        signal_strength += 20
    
    # Calculate targets
    if signal_type == 'BUY':
        take_profit = current_price + (50 * pip_size)
        stop_loss = current_price - (30 * pip_size)
    elif signal_type == 'SELL':
        take_profit = current_price - (50 * pip_size)
        stop_loss = current_price + (30 * pip_size)
    else:
        take_profit = current_price
        stop_loss = current_price
    
    # Generate reasoning
    reasoning = f"RSI: {rsi:.1f} ({'Oversold' if rsi < 30 else 'Overbought' if rsi > 70 else 'Neutral'}), "
    reasoning += f"MACD: {'Bullish' if macd_last > signal_last else 'Bearish'}, "
    reasoning += f"ADX: {adx_value:.1f} ({'Strong trend' if adx_value > 25 else 'Weak trend'})"
    
    return {
        'signal': signal_type,
        'confidence': min(signal_strength, 95),
        'entry_price': current_price,
        'take_profit': take_profit,
        'stop_loss': stop_loss,
        'reasoning': reasoning,
        'indicators': {
            'rsi': rsi,
            'macd': macd_last,
            'macd_signal': signal_last,
            'adx': adx_value,
            'momentum': momentum
        }
    }

@app.route('/api/signals', methods=['GET'])
@require_api_key
def get_signals():
    """Get trading signals for all currency pairs"""
    try:
        pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"]
        timeframe = request.args.get('timeframe', '60')
        
        signals = []
        for pair in pairs:
            try:
                data = fetch_forex_data(pair, timeframe)
                prediction = predict_trend(data)
                
                signals.append({
                    'id': f"{pair}_{int(datetime.now().timestamp())}",
                    'pair': pair,
                    'timeframe': timeframe,
                    'timestamp': datetime.now().isoformat(),
                    **prediction
                })
            except Exception as e:
                signals.append({
                    'id': f"{pair}_{int(datetime.now().timestamp())}",
                    'pair': pair,
                    'timeframe': timeframe,
                    'timestamp': datetime.now().isoformat(),
                    'signal': 'HOLD',
                    'confidence': 0,
                    'entry_price': 0,
                    'take_profit': 0,
                    'stop_loss': 0,
                    'reasoning': f"Error: {str(e)}",
                    'indicators': {}
                })
        
        return jsonify({
            'success': True,
            'signals': signals,
            'total': len(signals)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/signals/<pair>', methods=['GET'])
@require_api_key
def get_signal_for_pair(pair):
    """Get trading signal for a specific currency pair"""
    try:
        timeframe = request.args.get('timeframe', '60')
        data = fetch_forex_data(pair, timeframe)
        prediction = predict_trend(data)
        
        return jsonify({
            'success': True,
            'signal': {
                'id': f"{pair}_{int(datetime.now().timestamp())}",
                'pair': pair,
                'timeframe': timeframe,
                'timestamp': datetime.now().isoformat(),
                **prediction
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/chart-data/<pair>', methods=['GET'])
@require_api_key
def get_chart_data(pair):
    """Get chart data for a currency pair"""
    try:
        timeframe = request.args.get('timeframe', '60')
        data = fetch_forex_data(pair, timeframe)
        
        # Convert to chart format
        chart_data = []
        for item in data[-200:]:  # Last 200 points
            chart_data.append({
                'time': item['t'] // 1000,  # Convert to seconds
                'open': item['o'],
                'high': item['h'],
                'low': item['l'],
                'close': item['c'],
                'volume': item['v']
            })
        
        return jsonify({
            'success': True,
            'data': chart_data,
            'pair': pair,
            'timeframe': timeframe
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)