// This file defines the user schema for students, employees, and the admin account.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['STUDENT', 'EMPLOYEE', 'ADMIN'], required: true },
    userId: { type: String, unique: true },
    batchOrDept: { type: String, required: true },
    phone: { type: String },
    photo: { type: String },
    qrToken: { type: String, unique: true },
    validUntil: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
