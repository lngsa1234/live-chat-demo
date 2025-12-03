// config.js - ICE Server Configuration
// Copy this to your project root

module.exports = {
    // Development - Free STUN servers only
    development: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' }
        ]
    },

    // Production - With TURN servers
    production: {
        iceServers: [
            // STUN servers (free)
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            
            // TURN servers - Choose one option below:
            
            // Option 1: Metered.ca (Free tier: 50GB/month)
            // Sign up at: https://www.metered.ca/tools/openrelay/
            {
                urls: 'turn:a.relay.metered.ca:80',
                username: 'YOUR_METERED_USERNAME',
                credential: 'YOUR_METERED_CREDENTIAL',
            },
            {
                urls: 'turn:a.relay.metered.ca:80?transport=tcp',
                username: 'YOUR_METERED_USERNAME',
                credential: 'YOUR_METERED_CREDENTIAL',
            },
            {
                urls: 'turn:a.relay.metered.ca:443',
                username: 'YOUR_METERED_USERNAME',
                credential: 'YOUR_METERED_CREDENTIAL',
            },
            
            // Option 2: Xirsys (Free tier: 500MB/month)
            // Sign up at: https://xirsys.com/
            // {
            //     urls: 'turn:YOUR_XIRSYS_TURN_SERVER',
            //     username: 'YOUR_XIRSYS_USERNAME',
            //     credential: 'YOUR_XIRSYS_CREDENTIAL'
            // },
            
            // Option 3: Twilio STUN/TURN (Pay as you go)
            // Sign up at: https://www.twilio.com/stun-turn
            // {
            //     urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            //     username: 'YOUR_TWILIO_USERNAME',
            //     credential: 'YOUR_TWILIO_CREDENTIAL'
            // },
        ]
    }
};

// Usage Instructions:
// 1. Choose a TURN provider (Metered.ca recommended for free tier)
// 2. Sign up and get credentials
// 3. Replace YOUR_METERED_USERNAME and YOUR_METERED_CREDENTIAL
// 4. Update client code to use this config
