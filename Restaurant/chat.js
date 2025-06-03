// Chat functionality with WebSocket
const WebSocket = require('ws');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'restaurant',
  password: 'password',
  port: 5432,
});

// WebSocket server setup
function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    // Handle incoming messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        // Save message to database
        await pool.query(
          'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)',
          [data.senderId, data.receiverId, data.content]
        );

        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              senderId: data.senderId,
              content: data.content,
              timestamp: new Date().toISOString()
            }));
          }
        });
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}

module.exports = {
  setupWebSocketServer
};