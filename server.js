const express = require('express');
const WebSocket = require('ws');
const { RTCPeerConnection, RTCSessionDescription } = require('wrtc');

const app = express();
const wss = new WebSocket.Server({ noServer: true });

// Set up a simple database
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// Create a table for users or game states
db.run('CREATE TABLE players(id INTEGER PRIMARY KEY, name TEXT, x INTEGER, y INTEGER)');

app.use(express.static('public'));  // Serve static files from 'public' directory

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle WebSocket requests
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    
    	// Here you could handle incoming messages, like signaling for WebRTC
	const msg = JSON.parse(message);
        
        switch(msg.type) {
            case 'offer':
                // Handle WebRTC offer
                break;
            case 'answer':
                // Handle WebRTC answer
                break;
            case 'candidate':
                // Handle new ICE candidate
                break;
            default:
                console.log('Unknown message type:', msg.type);
        }
    });

    ws.send('something');
});

// Upgrade HTTP server to WebSocket
const server = app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

