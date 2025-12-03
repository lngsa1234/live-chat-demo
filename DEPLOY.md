# Deploy to Public URL - Complete Guide

Get your app live on the internet with a public URL in minutes!

## 🚀 Fastest Options (5-10 minutes)

### Option 1: Render.com (EASIEST - FREE)

**Steps:**

1. **Push to GitHub:**
   ```bash
   # In your production folder
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/coffee-chat.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com (sign up with GitHub)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: coffee-chat-yourname
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free
   - Click "Create Web Service"

3. **Add Environment Variables** (Optional - for TURN):
   - In Render dashboard, go to "Environment"
   - Add your TURN credentials:
     - `METERED_USERNAME`
     - `METERED_CREDENTIAL`

4. **Done!** Your URL: `https://coffee-chat-yourname.onrender.com`

**Pros:**
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ Auto-deploys on git push
- ✅ 5 minute setup

**Cons:**
- ⚠️ Free tier spins down after 15 min inactivity (first request takes 30 sec)

---

### Option 2: Railway (FREE $5 credit/month)

**Steps:**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   # In your production folder
   railway login
   railway init
   railway up
   ```

3. **Get your URL:**
   ```bash
   railway domain
   ```

4. **Add Environment Variables:**
   ```bash
   railway variables set METERED_USERNAME=your_username
   railway variables set METERED_CREDENTIAL=your_credential
   ```

**Your URL:** `https://your-app.up.railway.app`

**Pros:**
- ✅ Super fast deployment
- ✅ Automatic HTTPS
- ✅ No cold starts
- ✅ $5/month free credit

---

### Option 3: Heroku (Classic - FREE tier ending soon)

**Steps:**

1. **Install Heroku CLI:**
   ```bash
   # Mac
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy:**
   ```bash
   # In your production folder
   heroku login
   heroku create coffee-chat-yourname
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

3. **Add Environment Variables:**
   ```bash
   heroku config:set METERED_USERNAME=your_username
   heroku config:set METERED_CREDENTIAL=your_credential
   ```

4. **Open your app:**
   ```bash
   heroku open
   ```

**Your URL:** `https://coffee-chat-yourname.herokuapp.com`

**Note:** Heroku is ending free tier on November 28, 2022. Consider Render or Railway instead.

---

### Option 4: Vercel (With External WebSocket)

Vercel doesn't support WebSocket directly, but you can use it with an external WebSocket server.

**Setup:**

1. **Deploy WebSocket server to Render/Railway** (see above)

2. **Deploy client to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Update client to use external WebSocket:**
   In `public/index.html`, change:
   ```javascript
   const wsUrl = `wss://your-websocket-server.onrender.com`;
   ```

**Not recommended** - More complex setup.

---

## 🌍 Custom Domain (Optional)

Once deployed, you can add a custom domain:

### Render.com:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as shown

### Railway:
```bash
railway domain add yourdomain.com
```

### Heroku:
```bash
heroku domains:add yourdomain.com
```

Then update your DNS:
```
CNAME record: @ → your-app.provider.com
```

---

## 📱 Testing Your Public URL

1. **Open in browser:** `https://your-app.onrender.com`
2. **Create a room**
3. **Share URL + Room ID** with someone on a different network
4. **Both connect** - should work!

---

## 🔒 Important: HTTPS Required

WebRTC requires HTTPS in production. All the options above provide automatic HTTPS.

**Do NOT use:**
- HTTP (won't work for WebRTC)
- ngrok free tier (has limitations)
- Plain IP addresses (no HTTPS)

---

## 💰 Cost Comparison

| Service | Free Tier | Paid | Best For |
|---------|-----------|------|----------|
| Render | ✅ Free (with cold starts) | $7/month | Production apps |
| Railway | ✅ $5 credit/month | $5/month | All use cases |
| Heroku | ❌ Ending soon | $7/month | Legacy apps |
| Fly.io | ✅ 3 VMs free | $0.0000022/sec | Advanced users |
| DigitalOcean | ❌ $5/month | $5/month | Full control |

---

## 🎯 Recommended Path

**For Getting Started (Today):**
1. Deploy to **Render.com** (5 minutes, free)
2. Use free Metered.ca TURN server
3. Share your public URL!

**For Production:**
1. Use **Railway** ($5/month) - no cold starts
2. Add custom domain
3. Configure TURN servers properly
4. Monitor usage

---

## 🐛 Troubleshooting

### "WebSocket connection failed"
- Check if server is running: `curl https://your-app.com/health`
- Verify WebSocket URL in code
- Check server logs

### "Cold start takes too long" (Render free tier)
- Upgrade to paid plan ($7/month)
- Or switch to Railway
- Or keep a tab open to prevent sleeping

### "Can't connect between users"
- Ensure HTTPS (not HTTP)
- Add TURN servers
- Check firewall settings

---

## 📞 Quick Command Reference

### Render (via GitHub)
```bash
# Just push to GitHub, Render auto-deploys
git push origin main
```

### Railway
```bash
railway up          # Deploy
railway open        # Open in browser
railway logs        # View logs
railway status      # Check status
```

### Heroku
```bash
heroku logs --tail  # View logs
heroku restart      # Restart app
heroku open         # Open in browser
```

---

## ✨ What You Get

After deployment:
- ✅ Public HTTPS URL
- ✅ Works on any device/network
- ✅ Share with anyone worldwide
- ✅ Professional URL (add custom domain)
- ✅ Automatic SSL certificate
- ✅ Works with TURN servers

**Example URLs:**
- `https://coffee-chat-demo.onrender.com`
- `https://my-video-chat.up.railway.app`
- `https://videochat.yourdomain.com`

Now anyone can access your app from anywhere! 🌍🎉
