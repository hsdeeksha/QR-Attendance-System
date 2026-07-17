// This file handles attendance scanning and log retrieval via protected endpoints.
const express = require('express');
const authMiddleware = require('../middleware/auth');
const storage = require('../storage');

const router = express.Router();

router.post('/scan', authMiddleware, async (req, res) => {
  try {
    const { qrToken } = req.body;
    if (!qrToken) {
      return res.status(400).json({ message: 'QR token is required' });
    }

    const user = await storage.findUserByQrToken(qrToken);
    if (!user) {
      return res.status(404).json({ message: 'User not found for this QR code' });
    }

    const todayLogs = await storage.getTodayAttendance(user._id);
    
    if (todayLogs.length >= 2) {
      return res.status(400).json({ message: 'Already scanned today (In and Out recorded)' });
    }

    const nextType = todayLogs.length === 0 ? 'LOGIN' : 'LOGOUT';

    const populated = await storage.createAttendance({ userId: user._id, type: nextType });

    const io = req.app.get('io');
    io.emit('new-scan', populated);

    res.json({ success: true, record: populated });
  } catch (error) {
    res.status(500).json({ message: 'Scan failed', error: error.message });
  }
});

router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const logs = await storage.getAttendanceLogs();
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch logs' });
  }
});

router.get('/my-logs', authMiddleware, async (req, res) => {
  try {
    const logs = await storage.getUserAttendanceLogs(req.user.id);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch your logs' });
  }
});

module.exports = router;
