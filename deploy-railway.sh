#!/bin/bash

# Quick Deploy Script for Railway
# Makes deployment super easy!

echo "🚀 Coffee Chat Pro - Quick Deploy to Railway"
echo "=============================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "📦 Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed!"
    echo ""
fi

# Login to Railway
echo "🔐 Logging in to Railway..."
railway login

# Initialize project
echo ""
echo "📂 Initializing Railway project..."
railway init

# Add environment variables (optional)
echo ""
read -p "Do you want to add TURN server credentials? (y/n): " add_turn

if [ "$add_turn" = "y" ]; then
    echo ""
    echo "📝 Enter your Metered.ca credentials (from https://www.metered.ca/tools/openrelay/)"
    read -p "Metered Username: " metered_user
    read -p "Metered Credential: " metered_cred
    
    railway variables set METERED_USERNAME=$metered_user
    railway variables set METERED_CREDENTIAL=$metered_cred
    
    echo "✅ TURN credentials added!"
fi

# Deploy
echo ""
echo "🚀 Deploying to Railway..."
railway up

# Get the URL
echo ""
echo "🌐 Getting your public URL..."
sleep 5
railway domain

echo ""
echo "✨ Deployment Complete!"
echo ""
echo "📱 Your app is now live!"
echo "🔗 Access it using the URL shown above"
echo ""
echo "💡 Tips:"
echo "  - View logs: railway logs"
echo "  - Redeploy: railway up"
echo "  - Open app: railway open"
echo ""
echo "🎉 Happy video chatting!"
