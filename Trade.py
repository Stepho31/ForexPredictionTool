from flask import Flask, request, render_template_string
import requests
import pandas as pd
import numpy as np
from ta.trend import PSARIndicator
from ta.trend import IchimokuIndicator
from datetime import datetime, timedelta
import plotly.graph_objects as go
import smtplib
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
alerts = []

def fetch_forex_data(pair, time_frame):
    api_key = "hoEeyfMqcD7Ch779SoWBD8spANnA7TU0"
    ticker = f"C:{pair.replace('/', '')}"

    # Set the start and end times to fetch real-time data
    end_time = datetime.utcnow()  # Use UTC for real-time forex data
    start_time = end_time - timedelta(days=7)  # Fetch the last 7 days of data

    start_timestamp = int(start_time.timestamp() * 1000)  # Convert to milliseconds
    end_timestamp = int(end_time.timestamp() * 1000)  # Convert to milliseconds

    url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/{time_frame}/minute/{start_timestamp}/{end_timestamp}?apiKey={api_key}"

    response = requests.get(url)
    print(f"URL: {url}")  # Debug the full URL
    data = response.json()

    if "results" in data and isinstance(data["results"], list):
        return data["results"]
    elif "error" in data:
        raise Exception(f"API Error: {data['error']}")
    else:
        raise Exception("API returned no data or unexpected format")


def create_forex_chart(data):
    # Extract relevant data for the graph
    timestamps = [datetime.fromtimestamp(item['t'] / 1000) for item in data][-200:]  # Last 200 points
    close_prices = [item['c'] for item in data][-200:]  # Last 200 points

    # Create a Plotly line chart
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=timestamps, y=close_prices, mode='lines', name='Close Price'))
    fig.update_layout(
        title="Forex Close Price Trend (Recent Data)",
        xaxis_title="Date",
        yaxis_title="Price",
        template="plotly_dark",  # Use a dark theme to match your app
        title_x=0.5,  # Center title
    )
    return fig.to_html(full_html=False)

def fetch_forex_data_multiple_intervals(pair):
    intervals = ["60", "1440", "10080"]  # 1 hour, 1 day, 1 week
    combined_data = []
    for time_frame in intervals:
        combined_data.extend(fetch_forex_data(pair, time_frame))
    return combined_data

def analyze_currency_pairs(time_frame):
    currency_pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"]
    opportunities = []

    for pair in currency_pairs:
        try:
            data = fetch_forex_data(pair, time_frame)
            prediction = predict_trend(data)
            opportunities.append({"pair": pair, "prediction": prediction})
        except Exception as e:
            opportunities.append({"pair": pair, "prediction": f"Error: {str(e)}"})

    return opportunities

    
def calculate_rsi(prices, window=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_rsi_with_rolling(prices, window=14):
    # Use a rolling window to calculate RSI
    rsi_values = []
    for i in range(window, len(prices)):
        rsi_values.append(calculate_rsi(prices.iloc[i - window:i], window=window).iloc[-1])
    return rsi_values


def calculate_parabolic_sar(high, low, close):
    psar = PSARIndicator(high, low, close)
    return psar.psar()

def calculate_volatility(prices, window=14):
    return prices.pct_change().rolling(window).std()


def calculate_vwap(prices, volumes):
    cumulative_volumes = volumes.cumsum()
    cumulative_price_volumes = (prices * volumes).cumsum()
    return cumulative_price_volumes / cumulative_volumes

def calculate_ichimoku(high, low, window1=9, window2=26, window3=52):
    ichimoku = IchimokuIndicator(high, low, window1, window2, window3)
    return ichimoku.ichimoku_a(), ichimoku.ichimoku_b()


def calculate_sma(prices, window=14):
    return prices.rolling(window=window).mean()

def calculate_ema(prices, window=14):
    return prices.ewm(span=window, adjust=False).mean()

def calculate_macd(prices):
    ema_12 = prices.ewm(span=12, adjust=False).mean()
    ema_26 = prices.ewm(span=26, adjust=False).mean()
    macd = ema_12 - ema_26
    signal = macd.ewm(span=9, adjust=False).mean()
    return macd, signal

def calculate_bollinger_bands(prices, window=20):
    sma = calculate_sma(prices, window=window)
    std_dev = prices.rolling(window=window).std()
    upper_band = sma + (2 * std_dev)
    lower_band = sma - (2 * std_dev)
    return upper_band, lower_band

def calculate_atr(prices, high, low, window=14):
    high_low = high - low
    high_close = abs(high - prices.shift(1))
    low_close = abs(low - prices.shift(1))
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    atr = tr.rolling(window=window).mean()
    return atr

def calculate_stochastic_oscillator(prices, high, low, window=14):
    lowest_low = low.rolling(window=window).min()
    highest_high = high.rolling(window=window).max()
    k = 100 * (prices - lowest_low) / (highest_high - lowest_low)
    return k

def calculate_volume_signal(data, window=20):
    volumes = pd.Series([item['v'] for item in data])  # 'v' is volume
    avg_volume = volumes.rolling(window=window).mean()
    return volumes.iloc[-1] > avg_volume.iloc[-1]

def calculate_momentum(prices, window=10):
    return prices.diff(periods=window)


def calculate_adx(prices, high, low, window=14):
    # Calculate True Range (TR)
    high_low = high - low
    high_close = abs(high - prices.shift(1))
    low_close = abs(low - prices.shift(1))
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)

    # Calculate directional movement
    plus_dm = high.diff().clip(lower=0)  # Positive directional movement
    minus_dm = low.diff().clip(upper=0).abs()  # Negative directional movement

    # Calculate smoothed values
    atr = tr.rolling(window=window).mean()  # Average True Range
    plus_di = 100 * (plus_dm.rolling(window=window).mean() / atr)
    minus_di = 100 * (minus_dm.rolling(window=window).mean() / atr)

    # Calculate ADX
    dx = (abs(plus_di - minus_di) / (plus_di + minus_di)) * 100
    adx = dx.rolling(window=window).mean()

    return adx, plus_di, minus_di

def predict_trend(data):
    # Extract data
    prices = pd.Series([item['c'] for item in data])
    high = pd.Series([item['h'] for item in data])
    low = pd.Series([item['l'] for item in data])
    volumes = pd.Series([item['v'] for item in data])

    # Use only the last 100 data points for better trend analysis
    prices = prices[-100:]
    high = high[-100:]
    low = low[-100:]
    volumes = volumes[-100:]

    # Current price and targets
    current_price = prices.iloc[-1]
    pip_size = 0.0001  # Adjust for the currency pair
    upward_target = current_price + (50 * pip_size)
    downward_target = current_price - (50 * pip_size)

    # Calculate indicators
    rsi = calculate_rsi(prices).iloc[-1]
    macd, signal = calculate_macd(prices)
    macd_last = macd.iloc[-1]
    signal_last = signal.iloc[-1]
    adx, plus_di, minus_di = calculate_adx(prices, high, low)
    momentum = calculate_momentum(prices, window=10).iloc[-1]
    atr = calculate_atr(prices, high, low).iloc[-1]
    upper_band, lower_band = calculate_bollinger_bands(prices)

    # Trend direction
    if macd_last > signal_last and momentum > 0:
        trend_direction = "up"
    elif macd_last < signal_last and momentum < 0:
        trend_direction = "down"
    else:
        trend_direction = "sideways"

    # Breakout likelihood
    if current_price > upper_band.iloc[-1]:
        breakout_likelihood = "up"
    elif current_price < lower_band.iloc[-1]:
        breakout_likelihood = "down"
    else:
        breakout_likelihood = "low"

    # Combine predictions
    if breakout_likelihood == "up" and trend_direction == "up":
        return f"Price is likely to rise by 50 pips. Target: {upward_target:.5f}. If the price breaks above {upward_target:.5f}, this could confirm a bullish breakout and a potential 'Buy'."
    elif breakout_likelihood == "down" and trend_direction == "down":
        return f"Price is likely to drop by 50 pips. Target: {downward_target:.5f}. If the price falls below {downward_target:.5f}, this could confirm a bearish breakdown and a potential 'Sell'."
    else:
        return (f"Uncertain trend. Monitor price levels {upward_target:.5f} (upward) and {downward_target:.5f} (downward). "
                f"If the price breaks above {upward_target:.5f}, it could signal a potential 'Buy'. "
                f"If the price falls below {downward_target:.5f}, it could signal a potential 'Sell'.")

@app.route("/", methods=["GET", "POST"])
def forex_predict():
    if request.method == "POST":
        pair = request.form["pair"]
        time_frame = request.form["time_frame"]
        try:
            data = fetch_forex_data(pair, time_frame)
            prediction = predict_trend(data)
            chart_html = create_forex_chart(data)

            return render_template_string('''
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
                    <style>
                        body {
                            background: linear-gradient(135deg, #1e1e2f, #2a2c39);
                            color: #fff;
                            font-family: 'Poppins', sans-serif;
                        }
                        h1, h2, h3, h4, h5, h6 { color: #fff; }
                        p, label { color: #fff; }
                        .card {
                            background: rgba(35, 39, 42, 0.9);
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        }
                        .btn-purple {
                            background: linear-gradient(90deg, #6a11cb, #2575fc);
                            color: #fff;
                            font-weight: bold;
                            padding: 10px 20px;
                            border-radius: 5px;
                            transition: background 0.3s ease-in-out, transform 0.3s ease;
                        }
                        .btn-purple:hover {
                            transform: scale(1.1);
                            background: linear-gradient(90deg, #2575fc, #6a11cb);
                        }
                    </style>
                    <title>Forex Prediction</title>
                </head>
                <body>
                    <div class="container mt-5">
                        <div class="card p-4">
                            <h1 class="text-center">Prediction for {{ pair }}</h1>
                            <p><strong>Time Frame:</strong> {{ time_frame }}</p>
                            <p>
                                <strong>Recommended Action:</strong> {{ prediction }}
                            </p>
                            <div>
                                <h3>Forex Trend Chart</h3>
                                {{ chart_html | safe }}
                            </div>
                            <div class="text-center mt-4">
                                <a href="/" class="btn btn-purple">Analyze Another Pair</a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            ''', pair=pair, time_frame=time_frame, prediction=prediction, chart_html=chart_html)
        except Exception as e:
            return render_template_string('''
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        body { background: #2c2f33; color: #fff; font-family: Arial, sans-serif; }
                        p, label { color: #fff; }
                        .btn-purple { background-color: #7289da; color: #fff; }
                        .btn-purple:hover { background-color: #5a74b5; }
                    </style>
                    <title>Error</title>
                </head>
                <body>
                    <div class="container mt-5">
                        <div class="alert alert-danger">
                            <h1>Error</h1>
                            <p>{{ error }}</p>
                            <a href="/" class="btn btn-purple">Try Again</a>
                        </div>
                    </div>
                </body>
                </html>
            ''', error=str(e))
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            body { background: linear-gradient(135deg, #1e1e2f, #2a2c39); color: #fff; font-family: 'Poppins', sans-serif; }
            h1, h2, h3, h4, h5, h6 { color: #fff; }
            p, label { color: #fff; }
            .card { background: rgba(35, 39, 42, 0.9); border-radius: 10px; }
            .btn-purple { background: linear-gradient(90deg, #6a11cb, #2575fc); color: #fff; }
            .btn-purple:hover { transform: scale(1.1); }
        </style>
        <title>Forex Prediction</title>
    </head>
    <body>
        <div class="container mt-5">
            <div class="card p-4">
                <h1 class="text-center">Forex Prediction Tool</h1>
                <form method="post">
                    <div class="mb-3">
                        <label for="pair" class="form-label">Select Currency Pair:</label>
                        <select class="form-select" id="pair" name="pair" required>
                            <option value="EUR/USD">EUR/USD</option>
                            <option value="GBP/USD">GBP/USD</option>
                            <option value="USD/JPY">USD/JPY</option>
                            <option value="AUD/USD">AUD/USD</option>
                            <option value="USD/CAD">USD/CAD</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="time_frame" class="form-label">Select Time Frame:</label>
                        <select class="form-select" id="time_frame" name="time_frame" required>
                            <option value="5">5 Minutes</option>
                            <option value="15">15 Minutes</option>
                            <option value="60">1 Hour</option>
                            <option value="240">4 Hours</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-purple w-100">Analyze</button>
                </form>
            </div>
        </div>
    </body>
    </html>
    '''

if __name__ == "__main__":
    app.run(debug=True)
