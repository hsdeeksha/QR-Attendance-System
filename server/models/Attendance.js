// This file defines the attendance log schema used for scan events.
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['LOGIN', 'LOGOUT'], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
