# QR Attendance System

A modern, robust, and real-time QR Code based Attendance System. This application provides a seamless way to track attendance using auto-generated QR codes and a built-in scanner, backed by a scalable MongoDB Atlas database.

## Features

- **Dynamic QR Code Generation:** Automatically generates a unique QR code for each registered student or employee.
- **Real-time Attendance Scanning:** Built-in QR scanner to mark attendance instantly.
- **Admin Dashboard:** Comprehensive dashboard for administrators to view attendance logs, manage users, and generate reports.
- **Role-Based Access Control:** Distinct roles for `ADMIN` and `STUDENT/EMPLOYEE`.
- **Cloud Database:** Integrated with MongoDB Atlas for reliable and scalable data storage.
- **Real-Time Sync:** Utilizes Socket.io for real-time updates across connected clients.
- **Offline Fallback:** Local data store fallback mechanism ensures the application remains functional even during temporary database disconnections.
- **Premium UI:** Modern and dynamic user interface with responsive design.

## Tech Stack

### Frontend
- React.js
- QR Code Scanner/Generator Libraries
- Modern CSS (Glassmorphism, custom typography)

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io
- JWT & bcryptjs for Authentication

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hsdeeksha/QR-Attendance-System.git
   cd QR-Attendance-System
   ```

2. **Setup the Server:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory.
   - Add your MongoDB connection string and any other required variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup the Client:**
   ```bash
   cd ../client
   npm install
   ```
   - Start the frontend application:
     ```bash
     npm start
     ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`. 
   *Default Admin credentials (if bootstrapped):* `admin@admin.com` / `admin123`

## Usage

1. **Registration:** Users can register their profile and upload a profile photo. The system will generate a customized ID card with a QR code.
2. **Scanning:** The administrator or scanner application can scan the user's QR code upon entry.
3. **Dashboard:** Admins can log in to view real-time attendance, filter logs, and manage the system.

## License

This project is open-source and available under the [MIT License](LICENSE).
