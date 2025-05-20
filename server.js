import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { TurnixIO } from 'turnix-js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3000;
const BEARER_TOKEN = 'd1100ed3f46ee4be4073ae80c88fc2fe';

const rooms = {}; // { roomId: Set<clients> }

app.use(express.static('public'));
app.use(express.json());


//     // Filter each server's URLs to include only 'turns:' entries and change port 443 to 444
//     const filteredServers = iceServers
//         .map(server => {
//             const filteredUrls = server.urls
//                 .filter(url => url.startsWith('turns:'))
//                 .map(url => url.replace(':443', ':444'));
//
//             if (filteredUrls.length > 0) {
//                 return {
//                     ...server,
//                     urls: filteredUrls
//                 };
//             }
//             return null;
//         })
//         .filter(Boolean); // remove nulls




app.post('/ice', async (req, res) => {
    const turnix = new TurnixIO({
        bearerToken: BEARER_TOKEN,
        apiUrl: "https://staging.turnix.io/api/v1/credentials/ice"
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