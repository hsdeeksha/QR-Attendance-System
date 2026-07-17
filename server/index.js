// This file starts the Express server, connects MongoDB, and wires up Socket.IO.
// Force Google DNS to bypass ISP blocking of MongoDB Atlas SRV records
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const storage = require('./storage');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

app.set('io', io);
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (_req, res) => {
  res.json({ message: 'Attendance API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const handleError = (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.error(`Port ${port} is already in use. Trying ${nextPort}...`);
      server.removeListener('error', handleError);
      startServer(nextPort);
    } else {
      console.error('Server error', err);
      process.exit(1);
    }
  };

  server.once('error', handleError);
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    if (process.env.MONGO_URI) {
      console.log('MongoDB status checked.');
    }
  });
};

const bootstrapData = async () => {
  // 1. Admin
  let admin = await storage.findUserByEmail('admin@admin.com');
  if (!admin) {
    try { await storage.createUser({
      name: 'Administrator',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      userId: 'ADM-0001',
      batchOrDept: 'Administration',
      validUntil: 'December 2026',
      qrToken: uuidv4()
    }); } catch(e) { if(e.code !== 11000) console.error(e); }
  }

};

(async () => {
  try {
    const connected = await storage.connectDatabase(process.env.MONGO_URI);
    await bootstrapData();

    startServer(PORT);
    if (!connected) {
      console.log('MongoDB unavailable; using fallback storage.');
    }
  } catch (err) {
    console.error('Server startup failed', err);
    process.exit(1);
  }
})();

// Trigger nodemon restart after db clear
