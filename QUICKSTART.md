# Coffee Chat Pro - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Download & Extract
Download and extract the production folder.

### Step 2: Install & Run
```bash
cd production
npm install
npm start
```

### Step 3: Connect
1. Open http://localhost:3000
2. Click "Create New Room"
3. Copy the Room ID
4. Share with your partner
5. Partner joins with the Room ID
6. Start chatting! 🎉

## 📱 Testing Locally

**Same Computer:**
- Open two browser tabs
- Create room in first tab
- Join with Room ID in second tab

**Different Computers (Same Network):**
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Share: `http://YOUR_IP:3000`

## 🌐 Deploy to Internet

### Easiest: Heroku (Free)
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git init
git add .
git commit -m "Initial commit"
git push heroku main
heroku open
```

### Alternative: Render.com
1. Push to GitHub
2. Go to Render.com
3. New Web Service
4. Connect GitHub repo
5. Deploy!

## 🎯 Features

✅ Video & Audio Calls
✅ Screen Sharing  
✅ Text Chat
✅ Call Recording
✅ PiP Layout (click small video to swap)
✅ Works across different networks

## 🔧 Troubleshooting

**Can't connect?**
- Check firewall settings
- Try different browsers
- Use HTTPS in production

**No video?**
- Allow camera/mic permissions
- Use Chrome or Firefox
- Check camera isn't used by other apps

## 📞 Support

Questions? Check README.md for detailed docs!
