#!/bin/bash

echo "🚀 Setting up TradingSignals Pro Platform"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ .env.local created from template"
    echo "⚠️  Please update .env.local with your API keys and configuration"
else
    echo "✅ .env.local already exists"
fi

# Check if Python is installed for backend
if command -v python3 &> /dev/null; then
    echo "🐍 Python 3 detected: $(python3 --version)"
    
    # Create virtual environment for backend
    if [ ! -d "api/venv" ]; then
        echo "📦 Creating Python virtual environment..."
        cd api
        python3 -m venv venv
        cd ..
        echo "✅ Virtual environment created"
    fi
    
    # Install backend dependencies
    echo "📦 Installing backend dependencies..."
    cd api
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Python 3 not detected. Backend setup skipped."
    echo "   Install Python 3 to run the Flask API backend."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/avatars
mkdir -p logs

echo "✅ Directories created"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your API keys:"
echo "   - Firebase configuration"
echo "   - Stripe API keys"
echo "   - Polygon.io API key (optional)"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. (Optional) Start the Flask API backend:"
echo "   cd api && source venv/bin/activate && python main.py"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation: README.md"
echo "🆘 For support, check the README or create an issue"
echo ""
echo "Happy trading! 🚀"