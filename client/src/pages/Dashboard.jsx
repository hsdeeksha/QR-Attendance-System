// This page shows a user's dashboard with their ID card and recent attendance activity.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IDCard from '../components/IDCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/api/attendance/my-logs');
        setLogs(response.data.logs);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) fetchLogs();
  }, [user]);

  if (!user) return null;

  // Group logs by date
  const dailyAttendance = [];
  const tempGroups = {};

  logs.forEach(log => {
    const dateStr = new Date(log.createdAt).toLocaleDateString();
    if (!tempGroups[dateStr]) {
      tempGroups[dateStr] = { id: log._id, date: dateStr, login: '-', logout: '-' };
      dailyAttendance.push(tempGroups[dateStr]);
    }
    const timeStr = new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Assuming logs are sorted newest first from the backend:
    if (log.type === 'LOGIN') {
      tempGroups[dateStr].login = timeStr; // Overwrites so we get the earliest login
    } else if (log.type === 'LOGOUT') {
      if (tempGroups[dateStr].logout === '-') {
        tempGroups[dateStr].logout = timeStr; // Keeps the latest logout
      }
    }
  });

  const recentAttendance = dailyAttendance.slice(0, 7);

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Welcome, {user.name}</h2>
            <p><span className={`badge ${user.role === 'STUDENT' ? 'student' : user.role === 'EMPLOYEE' ? 'employee' : 'admin'}`}>{user.role}</span></p>
          </div>
          {user.role !== 'ADMIN' && (
            <button className="primary-btn" onClick={() => navigate('/card')}>Download My Card</button>
          )}
        </div>

        {user.role === 'ADMIN' ? (
          <div className="row spacer" style={{ gap: '20px', marginTop: '40px' }}>
            <button className="primary-btn" style={{ padding: '20px 40px', fontSize: '1.1rem' }} onClick={() => navigate('/scan')}>
              Open Scanner
            </button>
            <button className="primary-btn" style={{ padding: '20px 40px', fontSize: '1.1rem' }} onClick={() => navigate('/admin')}>
              Go to Admin Dashboard
            </button>
          </div>
        ) : (
          <>

        <div className="table-card spacer" style={{ marginTop: '40px' }}>
          <h3>Recent Attendance</h3>
          <table>
            <thead>
              <tr><th>Date</th><th>Login Time</th><th>Logout Time</th></tr>
            </thead>
            <tbody>
              {recentAttendance.length === 0 ? <tr><td colSpan="3" className="text-center">No attendance records yet.</td></tr> : recentAttendance.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.date}</strong></td>
                  <td>{item.login !== '-' ? <span className="badge in">{item.login}</span> : '-'}</td>
                  <td>{item.logout !== '-' ? <span className="badge out">{item.logout}</span> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
