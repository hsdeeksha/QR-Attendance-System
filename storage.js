// This file provides a simple fallback data store so the app can run even if MongoDB Atlas is unavailable.
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require('./models/User');
const AttendanceModel = require('./models/Attendance');

const DATA_FILE = path.join(__dirname, 'data.json');
let mode = 'mongoose';

const defaultData = { users: [], attendance: [] };

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
};

const readData = () => {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (error) {
    return { ...defaultData };
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const getSafeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return { ...rest, id: user._id || user.id };
};

const connectDatabase = async (uri) => {
  try {
    const connectionUri = (uri || process.env.MONGO_URI || '').trim();
    console.log('Attempting MongoDB connection...');
    console.log(connectionUri);
    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    mode = 'mongoose';
    return true;
  } catch (error) {
    mode = 'fallback';
    console.error('MongoDB connection failed with details:');
    console.error(error);
    return false;
  }
};

const getMode = () => mode;

const createUser = async (userInput) => {
  if (mode === 'mongoose') {
    const user = new UserModel(userInput);
    await user.save();
    return user.toObject();
  }

  const data = readData();
  const user = {
    _id: userInput._id || `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...userInput,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.users = [...data.users, user];
  writeData(data);
  return getSafeUser(user);
};

const findUserByEmail = async (email) => {
  if (mode === 'mongoose') {
    return UserModel.findOne({ email });
  }

  const data = readData();
  return data.users.find((user) => user.email === email) || null;
};

const findUserById = async (id) => {
  if (mode === 'mongoose') {
    return UserModel.findById(id).select('-password');
  }

  const data = readData();
  const user = data.users.find((item) => item._id === id);
  return user ? getSafeUser(user) : null;
};

const findUserByQrToken = async (token) => {
  if (mode === 'mongoose') {
    return UserModel.findOne({ qrToken: token });
  }

  const data = readData();
  return data.users.find((user) => user.qrToken === token) || null;
};

const getAllUsers = async () => {
  if (mode === 'mongoose') {
    return UserModel.find().select('-password');
  }

  const data = readData();
  return data.users.map(u => getSafeUser(u));
};

const getAttendanceLogs = async () => {
  if (mode === 'mongoose') {
    return AttendanceModel.find().populate('userId').sort({ createdAt: -1 });
  }

  const data = readData();
  return data.attendance
    .map((item) => ({ ...item, userId: data.users.find((user) => user._id === item.userId) || null }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getUserAttendanceLogs = async (userId) => {
  if (mode === 'mongoose') {
    return AttendanceModel.find({ userId }).populate('userId').sort({ createdAt: -1 });
  }

  const data = readData();
  return data.attendance
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, userId: data.users.find((user) => user._id === item.userId) || null }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const createAttendance = async (record) => {
  if (mode === 'mongoose') {
    const attendance = new AttendanceModel(record);
    await attendance.save();
    return AttendanceModel.findById(attendance._id).populate('userId');
  }

  const data = readData();
  const attendance = {
    _id: record._id || `attendance-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...record,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.attendance = [attendance, ...data.attendance];
  writeData(data);
  const user = data.users.find((item) => item._id === attendance.userId);
  return { ...attendance, userId: user || null };
};

const findLastAttendance = async (userId) => {
  if (mode === 'mongoose') {
    return AttendanceModel.findOne({ userId }).sort({ createdAt: -1 });
  }

  const data = readData();
  return data.attendance
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
};

const getTodayAttendance = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  if (mode === 'mongoose') {
    return AttendanceModel.find({ 
      userId, 
      createdAt: { $gte: startOfDay } 
    }).sort({ createdAt: 1 });
  }

  const data = readData();
  return data.attendance
    .filter((item) => item.userId === userId && new Date(item.createdAt) >= startOfDay)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

module.exports = {
  connectDatabase,
  getMode,
  createUser,
  findUserByEmail,
  findUserById,
  findUserByQrToken,
  getAttendanceLogs,
  getUserAttendanceLogs,
  createAttendance,
  findLastAttendance,
  getSafeUser,
  getAllUsers,
  getTodayAttendance
};
