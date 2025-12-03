# Coffee Chat Pro - Production Version

A production-ready 1:1 video chat application with WebRTC, screen sharing, chat messaging, and call recording.

## Features

✨ **Core Features:**
- 1:1 Video & Audio Calls
- Real-time Text Chat
- Screen Sharing
- Call Recording
- Picture-in-Picture Layout
- Room-based Connection

🔒 **Production Ready:**
- WebSocket Signaling Server
- **TURN Server Support** (for NAT traversal)
- Works across different networks
- Multiple STUN servers for reliability
- Automatic reconnection handling
- Error handling & user feedback

## TURN Server Setup (Optional but Recommended)

For better connectivity through firewalls and NAT, configure TURN servers:

**Quick Setup (5 minutes):**
```bash
# 1. Sign up at https://www.metered.ca/tools/openrelay/
# 2. Copy credentials to .env
cp .env.example .env
# Edit .env and add your credentials
# 3. Restart server
npm start
```

See **TURN_SETUP.md** for detailed instructions and provider comparisons.

**Why TURN?**
- STUN (included): Works for ~80% of connections
- TURN (optional): Required for strict NAT/corporate firewalls
- Free tier available (Metered.ca: 50GB/month)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Connect

1. Open `http://localhost:3000` in your browser
2. Click "Create New Room" (generates a random room ID)
3. Share the Room ID with your partner
4. Partner enters the Room ID and clicks "Join Room"
5. Both will be connected!

## Development Mode

For development with auto-restart:

```bash
npm run dev
```

## Deployment Options

### Option 1: Heroku

1. Create a Heroku account and install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`
5. Open: `heroku open`

**Heroku Procfile** (already included):
```
web: node server.js
```

### Option 2: DigitalOcean

1. Create a Droplet (Ubuntu 22.04)
2. SSH into your server
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone your repository
5. Install dependencies: `npm install`
6. Install PM2: `sudo npm install -g pm2`
7. Start app: `pm2 start server.js`
8. Save PM2 config: `pm2 save`
9. Setup auto-start: `pm2 startup`

**Nginx Configuration** (recommended):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: AWS EC2

1. Launch EC2 instance (t2.micro for testing)
2. Configure Security Group:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 3000 (App)
3. Follow similar steps as DigitalOcean

### Option 4: Vercel (Serverless)

**Note:** WebSocket requires persistent connections. For Vercel:
1. Use a separate WebSocket server (Heroku/DO)
2. Or use Vercel with Socket.io + Redis adapter

### Option 5: Render

1. Create account on Render.com
2. New > Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Deploy

## SSL/HTTPS (Required for Production)

WebRTC requires HTTPS in production. Options:

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Using Cloudflare (Free)

1. Add your domain to Cloudflare
2. Enable "Full" SSL mode
3. Point DNS to your server

## Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=production
```

Update `server.js` to use:
```javascript
const PORT = process.env.PORT || 3000;
```

## Adding TURN Servers (NAT Traversal)

For better connectivity, add TURN servers:

```javascript
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:your-turn-server.com:3478',
            username: 'username',
            credential: 'password'
        }
    ]
};
```

**Free TURN Server Options:**
- Metered.ca (free tier)
- Xirsys (free tier)
- Self-host with Coturn

## Monitoring

### Basic Health Check

The app includes a `/health` endpoint:
```bash
curl http://localhost:3000/health
```

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
```

### Production Monitoring Tools
- New Relic
- DataDog
- Sentry (error tracking)

## Scaling Considerations

### Current Setup
- Supports 1:1 calls only
- Single server instance
- In-memory room storage

### For Scaling
1. **Redis** for distributed state
2. **Load Balancer** for multiple servers
3. **Sticky Sessions** for WebSocket
4. **Separate Signaling Server** from static files

## Security

### Implemented
- WebSocket message validation
- Room size limits (2 participants)
- Connection state management

### Recommended Additions
- Rate limiting
- User authentication
- Room passwords
- Time-limited room IDs
- CORS configuration

### Example Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## Troubleshooting

### WebSocket Connection Fails
- Check firewall allows WebSocket
- Verify SSL certificate if using HTTPS
- Check browser console for errors

### Video Not Showing
- Ensure HTTPS in production
- Check camera/microphone permissions
- Try different STUN/TURN servers

### High Latency
- Add TURN servers closer to users
- Use CDN for static files
- Optimize video quality settings

## File Structure

```
production/
├── server.js           # WebSocket signaling server
├── package.json        # Dependencies
├── public/
│   └── index.html     # Client application
└── README.md          # This file
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Cost Estimates

**Free Tier Options:**
- Heroku: Free (with limitations)
- Render: Free tier available
- Railway: Free tier available

**Paid Options:**
- DigitalOcean: $5-10/month (basic droplet)
- AWS EC2: $5-15/month (t2.micro)
- Heroku: $7/month (Hobby tier)

**Additional Costs:**
- Domain: $10-15/year
- SSL Certificate: Free (Let's Encrypt)
- TURN Server: $0-20/month

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
