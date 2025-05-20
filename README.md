# 🎥 turnix-js WebRTC Relay-Only Demo

This is a minimal WebRTC demo project using [`turnix-js`](https://www.npmjs.com/package/turnix-js) to request TURN-only ICE credentials and establish a peer-to-peer media stream between two browsers.

> ✅ TURN-only enforced using `iceTransportPolicy: "relay"`  
> ✅ One-way video stream from **Sender** to **Receiver**  
> ✅ Custom signaling server built with WebSocket and Express

---

## ⚙️ Prerequisites

- ✅ A **free account** at [https://turnix.io](https://turnix.io)
- 🔐 A **Bearer API token** from the TURNIX dashboard


---

## 🚀 Quick Start

### 1. Clone and install dependencies

```bash
git clone https://github.com/turnixio/turnix-js-demo.git
cd turnix-js-demo
npm install
```

### 2. Set your TURNIX API token

Edit `server.js` and set:

```js
const BEARER_TOKEN = 'your-turnix-api-token-here';
```

---

### 3. Run the signaling server

```bash
node server.js
```

This starts:

- Express static server at `http://localhost:3000`
- WebSocket signaling at `ws://localhost:3000?room=room1`

---

### 4. Open demo in browser

Open these in **separate tabs** or **devices**:

- **Receiver first**:
  ```
  http://localhost:3000/receiver.html
  ```

- **Then Sender**:
  ```
  http://localhost:3000/sender.html
  ```

✅ Sender streams camera via TURN-only  
✅ Receiver displays the video using `relay` connection

---

## 🔧 Config Behavior

- Only **sender** requests ICE credentials from `/ice`
- TURN-only is enforced by filtering `turn:` and `turns:` URLs
- `iceTransportPolicy: "relay"` ensures all traffic goes through the TURN server

---

## 🧪 Tested On

- Chrome ✅
- Firefox ✅ (*Note: autoplay requires muted video*)


---

## 🔗 Resources

- [turnix-js on npm](https://www.npmjs.com/package/turnix-js)
- [TURNIX API Docs](https://staging.turnix.io/docs)
- [WebRTC Overview](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

## 🪪 License

MIT License — use, modify, and build upon this freely.
