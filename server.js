import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { TurnixIO } from 'turnix-js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3000;
const BEARER_TOKEN = 'your-turnix-api-token-here';

const rooms = {}; // { roomId: Set<clients> }

app.use(express.static('public'));
app.use(express.json());

app.post('/ice', async (req, res) => {
    const turnix = new TurnixIO({
        bearerToken: BEARER_TOKEN,
    });

    const iceServers = await turnix.requestCredentials({
        room: 'room1',
        initiatorClient: 'alice',
        receiverClient: 'bob'
    });

    console.log('TURN servers:', JSON.stringify(iceServers, null, 2));

    res.json({ iceServers });
});

wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.replace('/?', ''));
    const room = params.get('room');
    if (!room) return ws.close();

    rooms[room] = rooms[room] || new Set();
    rooms[room].add(ws);

    ws.on('message', (msg) => {
        rooms[room].forEach(client => {
            if (client !== ws && client.readyState === 1) {
                client.send(msg);
            }
        });
    });

    ws.on('close', () => {
        rooms[room].delete(ws);
        if (rooms[room].size === 0) delete rooms[room];
    });
});

server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});