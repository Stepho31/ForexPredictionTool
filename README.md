# Forex Prediction Tool

## Overview

**Forex Prediction Tool** is a Flask-based web application that provides insights into forex trading by analyzing currency pair trends and offering actionable predictions. This project combines real-time data analysis with intuitive visualizations to assist users in making informed trading decisions.

---

## Features

- **Real-Time Data**: Fetch the latest forex data using the Polygon.io API.
- **Interactive Charts**: Visualize currency trends with dynamic, interactive Plotly graphs.
- **Customizable Options**:
  - Select currency pairs (e.g., EUR/USD, GBP/USD, USD/JPY).
  - Choose time intervals (5 minutes, 15 minutes, 1 hour, or 4 hours).
- **Actionable Predictions**:
  - Displays recommendations like "Buy" or "Sell" based on technical analysis.
  - Uses indicators such as MACD, RSI, Bollinger Bands, and more.

---

## Technologies Used

- **Backend**: Flask
- **Frontend**: HTML, CSS, Bootstrap
- **Charting**: Plotly
- **APIs**: Polygon.io
- **Libraries**:
  - `pandas` for data manipulation.
  - `ta` for calculating technical indicators.

---

## Installation

### Prerequisites

- Python 3.8+
- A valid API key from [Polygon.io](https://polygon.io)

### Steps to Set Up Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ForexPredictionTool.git
   cd ForexPredictionTool
   
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   
4. Add your API key to the code: Replace the placeholder YOUR_API_KEY in fetch_forex_data with your API key:
   ```bash
   api_key = "YOUR_API_KEY"

5. Run the app:
   ```bash
   python app.py
6. Access the app in your browser:
   ```bash
   http://127.0.0.1:5000/
8. Create and activate a virtual environment:


   ## How It Works

1. **Select Inputs**:  
   - Choose a currency pair (e.g., EUR/USD, GBP/USD) and a time frame (e.g., 5 minutes, 1 hour) from the dropdown menus.

2. **Analyze Data**:  
   - The app fetches real-time forex data from the Polygon.io API and performs technical analysis using indicators like MACD, RSI, and Bollinger Bands.

3. **View Insights**:  
   - Results include:  
     - Interactive trend charts to visualize currency performance.  
     - Predictions with buy/sell recommendations.

---

## Example Usage

- **Currency Pair**: EUR/USD  
- **Time Frame**: 1 Hour  
- **Prediction**:  
  `"Price is likely to rise by 50 pips. Target: 1.06500."`

---

## Future Plans

- Integrate **WebSocket** for live updates to the charts and predictions.
- Add **user accounts** to save preferences and analysis history.
- Expand technical indicators (e.g., **Ichimoku Clouds**, **ATR**) for advanced trading insights.
- Support additional assets, including more currency pairs and **cryptocurrencies**.

---

## Contributing

Contributions are always welcome! 









   
