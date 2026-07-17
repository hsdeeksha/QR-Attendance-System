const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const UserModel = require('./models/User');
const AttendanceModel = require('./models/Attendance');

dotenv.config();

async function clearDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (uri) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000, connectTimeoutMS: 15000 });
      console.log('Dropping User collection...');
      await UserModel.deleteMany({});
      console.log('Dropping Attendance collection...');
      await AttendanceModel.deleteMany({});
      console.log('MongoDB cleared successfully.');
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error('Error clearing MongoDB:', err);
  }

  // Clear data.json fallback
  const dataFile = path.join(__dirname, 'data.json');
  if (fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [], attendance: [] }, null, 2));
    console.log('Fallback data.json cleared.');
  }

  console.log('Database clearing process complete.');
}

clearDB();
