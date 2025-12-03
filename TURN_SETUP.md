# TURN Server Setup Guide

## Why Do You Need TURN Servers?

**STUN vs TURN:**
- **STUN** (included by default): Works for ~80% of connections
- **TURN** (requires setup): Required for strict NAT/firewall scenarios

**When TURN is needed:**
- Corporate networks with strict firewalls
- Some mobile networks
- Symmetric NAT configurations
- When direct peer-to-peer connection fails

## Option 1: Metered.ca (Recommended - FREE)

**Best for:** Small to medium apps, free tier is generous

### Setup Steps:

1. **Sign up** at https://www.metered.ca/tools/openrelay/

2. **Get your credentials:**
   - After signup, you'll see your TURN server credentials
   - Username format: Usually a UUID
   - Credential: A long string/password

3. **Configure your app:**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env:**
   ```env
   METERED_USERNAME=your_username_here
   METERED_CREDENTIAL=your_credential_here
   ```

5. **Restart server:**
   ```bash
   npm start
   ```

6. **Verify:** Check server logs for "✓ TURN servers configured"

**Free Tier:**
- 50GB bandwidth/month
- Unlimited users
- Global network
- Perfect for most apps!

## Option 2: Xirsys (FREE Tier)

**Best for:** Testing and small deployments

### Setup Steps:

1. **Sign up** at https://xirsys.com/

2. **Create a Channel:**
   - Go to Dashboard → Channels
   - Create new channel
   - Get your credentials

3. **Configure .env:**
   ```env
   TURN_SERVER=turn:YOUR_SERVER.xirsys.com:3478
   TURN_USERNAME=your_username
   TURN_CREDENTIAL=your_credential
   ```

**Free Tier:**
- 500MB bandwidth/month
- Good for testing
- Easy setup

## Option 3: Twilio (PAY AS YOU GO)

**Best for:** Production apps with budget

### Setup Steps:

1. **Sign up** at https://www.twilio.com/stun-turn

2. **Get credentials** from Twilio console

3. **Configure .env:**
   ```env
   TURN_SERVER=turn:global.turn.twilio.com:3478?transport=udp
   TURN_USERNAME=your_twilio_username
   TURN_CREDENTIAL=your_twilio_credential
   ```

**Pricing:**
- $0.0004 per GB
- Very reliable
- Global network

## Option 4: Self-Hosted Coturn (FREE but requires VPS)

**Best for:** Full control, unlimited bandwidth

### Requirements:
- A VPS (DigitalOcean, AWS, etc.)
- Ubuntu 20.04 or later
- Public IP address

### Setup Steps:

1. **Install Coturn:**
   ```bash
   sudo apt update
   sudo apt install coturn
   ```

2. **Edit config** `/etc/turnserver.conf`:
   ```conf
   listening-port=3478
   fingerprint
   lt-cred-mech
   user=username:password
   realm=yourdomain.com
   
   # Your server's public IP
   external-ip=YOUR_PUBLIC_IP
   
   # For TLS (recommended)
   cert=/etc/letsencrypt/live/yourdomain.com/cert.pem
   pkey=/etc/letsencrypt/live/yourdomain.com/privkey.pem
   ```

3. **Enable Coturn:**
   ```bash
   sudo systemctl enable coturn
   sudo systemctl start coturn
   ```

4. **Open firewall ports:**
   ```bash
   sudo ufw allow 3478/tcp
   sudo ufw allow 3478/udp
   sudo ufw allow 49152:65535/udp
   ```

5. **Configure your app:**
   ```env
   TURN_SERVER=turn:your-server.com:3478
   TURN_USERNAME=username
   TURN_CREDENTIAL=password
   ```

**Cost:**
- $5-10/month (VPS)
- Unlimited bandwidth
- Full control

## Testing Your TURN Server

### Method 1: Check Server Logs
When you start the app, look for:
```
✓ TURN servers configured (Metered.ca)
```

Or:
```
⚠ No TURN servers configured - connections may fail behind strict NAT
```

### Method 2: Browser Console
Open browser console and check for ICE server logs:
```javascript
console.log('ICE servers loaded:', data.iceServers.length, 'servers');
```

### Method 3: Online Trickle ICE Test
1. Go to https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. Add your TURN server details
3. Click "Gather candidates"
4. Look for "relay" type candidates (these are TURN)

### Method 4: Test in Restrictive Network
- Test from corporate network
- Test from mobile hotspot
- If it works, TURN is working!

## Recommended Setup by Use Case

### Personal Project / Testing
- **Metered.ca Free Tier**
- 50GB/month is plenty
- No credit card needed
- Easy setup

### Small Business / Startup
- **Metered.ca Free → Paid**
- Start free, scale as needed
- $29/month for 250GB

### Medium Business
- **Twilio**
- Pay for what you use
- Very reliable
- Good analytics

### Large Scale / Enterprise
- **Self-hosted Coturn**
- Multiple servers in different regions
- Full control
- Most cost-effective at scale

## Bandwidth Estimation

**Per call:**
- Video call (720p): ~2-4 MB/minute
- Video call (1080p): ~4-8 MB/minute

**Examples:**
- 10 calls/day × 30 min each × 3 MB/min = ~10GB/month
- 50 calls/day × 30 min each × 3 MB/min = ~45GB/month

**Note:** Only uses TURN bandwidth when direct P2P fails (usually 20-30% of calls)

## Troubleshooting

### TURN not working?

1. **Check credentials:**
   ```bash
   echo $METERED_USERNAME
   echo $METERED_CREDENTIAL
   ```

2. **Test server directly:**
   ```bash
   npm start
   ```
   Look for configuration messages

3. **Check browser console:**
   - Open DevTools → Console
   - Look for "ICE servers loaded"
   - Check for relay candidates

4. **Firewall issues:**
   - TURN needs port 3478 (TCP/UDP)
   - Also needs UDP ports 49152-65535
   - Check VPS/cloud firewall settings

### Still having issues?

- Try Metered.ca first (easiest to set up)
- Test with Trickle ICE tool
- Check browser console for WebRTC errors
- Ensure HTTPS in production

## Security Best Practices

1. **Never commit .env file to Git** (already in .gitignore)

2. **Rotate credentials regularly:**
   - Change TURN passwords every 3-6 months
   - Use environment variables, not hardcoded

3. **Use time-limited credentials:**
   - Some TURN servers support temporary tokens
   - Reduces risk if credentials leak

4. **Monitor usage:**
   - Check TURN server logs
   - Watch for abuse
   - Set bandwidth alerts

## Cost Comparison

| Provider | Free Tier | Paid | Best For |
|----------|-----------|------|----------|
| Metered.ca | 50GB/month | $29/250GB | Small-medium apps |
| Xirsys | 500MB/month | $20/25GB | Testing only |
| Twilio | None | $0.0004/GB | Pay-as-you-grow |
| Self-hosted | N/A | $5-10/month VPS | High volume |

## Conclusion

**Quick Start:** Use Metered.ca free tier (takes 5 minutes)

**Production:** 
- Small app → Metered.ca
- Medium app → Twilio
- Large app → Self-hosted Coturn

TURN servers significantly improve connection reliability, especially for users behind corporate firewalls or on restrictive networks. The free Metered.ca tier is perfect for getting started!
