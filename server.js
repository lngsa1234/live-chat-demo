// server.js - Production WebSocket Signaling Server
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));

// ICE Server Configuration API
app.get('/api/ice-servers', (req, res) => {
    const iceServers = [
        // STUN servers (always available)
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ];

    // Add TURN servers if credentials are configured
    if (process.env.METERED_USERNAME && process.env.METERED_CREDENTIAL) {
        iceServers.push(
            {
                urls: 'turn:a.relay.metered.ca:80',
                username: process.env.METERED_USERNAME,
                credential: process.env.METERED_CREDENTIAL,
            },
            {
                urls: 'turn:a.relay.metered.ca:80?transport=tcp',
                username: process.env.METERED_USERNAME,
                credential: process.env.METERED_CREDENTIAL,
            },
            {
                urls: 'turn:a.relay.metered.ca:443',
                username: process.env.METERED_USERNAME,
                credential: process.env.METERED_CREDENTIAL,
            }
        );
        console.log('✓ TURN servers configured (Metered.ca)');
    } else if (process.env.TURN_SERVER && process.env.TURN_USERNAME) {
        iceServers.push({
            urls: process.env.TURN_SERVER,
            username: process.env.TURN_USERNAME,
            credential: process.env.TURN_CREDENTIAL,
        });
        console.log('✓ TURN server configured (Custom)');
    } else {
        console.log('⚠ No TURN servers configured - connections may fail behind strict NAT');
        console.log('  See .env.example for setup instructions');
    }

    res.json({ iceServers });
});

// Store rooms and their participants
const rooms = new Map();

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'join':
                    handleJoin(ws, data);
                    break;
                case 'offer':
                case 'answer':
                case 'ice-candidate':
                    handleSignaling(ws, data);
                    break;
                case 'leave':
                    handleLeave(ws);
                    break;
                case 'chat':
                    handleChat(ws, data);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on('close', () => {
        handleLeave(ws);
        console.log('Client disconnected');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function handleJoin(ws, data) {
    const { roomId } = data;
    
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
    }
    
    const room = rooms.get(roomId);
    
    // Limit to 2 participants per room
    if (room.size >= 2) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
        return;
    }
    
    ws.roomId = roomId;
    const isInitiator = room.size === 0; // First person is the initiator
    room.add(ws);
    
    // Notify client they joined successfully
    ws.send(JSON.stringify({ 
        type: 'joined', 
        roomId,
        participantCount: room.size,
        isInitiator: isInitiator  // Tell them if they should create offer
    }));
    
    // If second person joins, tell first person to create offer
    if (room.size === 2) {
        console.log('Second person joined, sending start-call to initiator');
        room.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // Tell the first person (initiator) to start
                console.log('Sending start-call signal to initiator');
                client.send(JSON.stringify({ type: 'start-call' }));
            }
        });
    }
    
    console.log(`Client joined room: ${roomId}, participants: ${room.size}, isInitiator: ${isInitiator}`);
}

function handleSignaling(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;
    
    // Forward signaling messages to other participant
    const room = rooms.get(roomId);
    if (room) {
        room.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

function handleChat(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;
    
    // Forward chat messages to other participant
    const room = rooms.get(roomId);
    if (room) {
        room.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'chat',
                    message: data.message,
                    timestamp: data.timestamp
                }));
            }
        });
    }
}

function handleLeave(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;
    
    const room = rooms.get(roomId);
    if (room) {
        room.delete(ws);
        
        // Notify other participant
        room.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'peer-left' }));
            }
        });
        
        // Clean up empty rooms
        if (room.size === 0) {
            rooms.delete(roomId);
        }
        
        console.log(`Client left room: ${roomId}`);
    }
}

function broadcastToRoom(roomId, message) {
    const room = rooms.get(roomId);
    if (room) {
        room.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        rooms: rooms.size,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
