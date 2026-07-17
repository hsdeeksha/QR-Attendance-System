// Seed comment: This page displays real-time attendance analytics, supports client-side CSV downloads, and updates dynamically via socket.io events.
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ATTENDANCE');
  const [stats, setStats] = useState({ total: 0, inCount: 0, students: 0, employees: 0 });

  useEffect(() => {
    // Connect to WebSocket server for live attendance updates
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    socket.on('new-scan', (record) => {
      setLogs((prev) => [record, ...prev]);
    });

    const fetchData = async () => {
      try {
        const [logsRes, usersRes] = await Promise.all([
          api.get('/api/attendance/logs'),
          api.get('/api/auth/users')
        ]);
        setLogs(logsRes.data.logs);
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };

    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Compute live statistics based on current logs state
  useEffect(() => {
    const total = logs.length;
    const latestByUser = new Map();

    logs.forEach((item) => {
      const userObj = item.userId;
      const userKey = userObj?._id || userObj;
      if (!userKey) return;
      
      const existing = latestByUser.get(userKey);
      if (!existing || new Date(item.createdAt) > new Date(existing.createdAt)) {
        latestByUser.set(userKey, item);
      }
    });

    // Count of users whose latest record is LOGIN
    const inCount = Array.from(latestByUser.values()).filter((item) => item.type === 'LOGIN').length;
    
    // Unique student and employee counts in the current log database
    const students = new Set(
      logs
        .filter((item) => item.userId?.role === 'STUDENT')
        .map((item) => item.userId?._id || item.userId)
    ).size;

    const employees = new Set(
      logs
        .filter((item) => item.userId?.role === 'EMPLOYEE')
        .map((item) => item.userId?._id || item.userId)
    ).size;

    setStats({ total, inCount, students, employees });
  }, [logs]);

  // Filter logs list based on active filter button
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (filter === 'ALL') return true;
      if (filter === 'STUDENT' || filter === 'EMPLOYEE') {
        return item.userId?.role === filter;
      }
      if (filter === 'IN' || filter === 'OUT') {
        return item.type === (filter === 'IN' ? 'LOGIN' : 'LOGOUT');
      }
      return true;
    });
  }, [logs, filter]);

  const studentsList = useMemo(() => users.filter(u => u.role === 'STUDENT'), [users]);
  const employeesList = useMemo(() => users.filter(u => u.role === 'EMPLOYEE'), [users]);

  // Export filtered logs to CSV without external libraries
  const exportCsv = () => {
    const header = ['#', 'Name', 'User ID', 'Role', 'Date', 'Time', 'Status'];
    const rows = filteredLogs.map((item, index) => {
      const name = item.userId?.name || 'N/A';
      const uid = item.userId?.userId || 'N/A';
      const role = item.userId?.role || 'N/A';
      const date = new Date(item.createdAt).toLocaleDateString();
      const time = new Date(item.createdAt).toLocaleTimeString();
      const status = item.type === 'LOGIN' ? 'IN' : 'OUT';
      return [
        index + 1,
        `"${name.replace(/"/g, '""')}"`,
        `"${uid.replace(/"/g, '""')}"`,
        role,
        date,
        time,
        status
      ];
    });

    const csvContent = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.id = 'csv-download-link';
    link.href = url;
    link.download = `Attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="admin-header row">
          <div>
            <h2>Admin Dashboard</h2>
            <p className="page-subtitle">Real-time attendance logs and analytics.</p>
          </div>
          <button id="btn-export-csv" className="primary-btn" onClick={exportCsv}>
            Export CSV
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Scans</h4>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h4>Currently IN</h4>
            <div className="stat-value highlight-in">{stats.inCount}</div>
          </div>
          <div className="stat-card">
            <h4>Students</h4>
            <div className="stat-value">{stats.students}</div>
          </div>
          <div className="stat-card">
            <h4>Employees</h4>
            <div className="stat-value">{stats.employees}</div>
          </div>
        </div>

        <div className="filter-bar spacer" style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '0' }}>
          <div className="filter-buttons" style={{ gap: '0' }}>
            <button 
              className={activeTab === 'ATTENDANCE' ? 'primary-btn' : 'secondary-btn'} 
              style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === 'ATTENDANCE' ? 'none' : '1px solid #ccc' }}
              onClick={() => setActiveTab('ATTENDANCE')}
            >
              Attendance Logs
            </button>
            <button 
              className={activeTab === 'STUDENTS' ? 'primary-btn' : 'secondary-btn'} 
              style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === 'STUDENTS' ? 'none' : '1px solid #ccc' }}
              onClick={() => setActiveTab('STUDENTS')}
            >
              Registered Students
            </button>
            <button 
              className={activeTab === 'EMPLOYEES' ? 'primary-btn' : 'secondary-btn'} 
              style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === 'EMPLOYEES' ? 'none' : '1px solid #ccc' }}
              onClick={() => setActiveTab('EMPLOYEES')}
            >
              Registered Employees
            </button>
          </div>
        </div>

        {activeTab === 'ATTENDANCE' && (
          <>
            <div className="filter-bar spacer">
              <span className="filter-label">Filter Logs:</span>
              <div className="filter-buttons">
                {['ALL', 'STUDENT', 'EMPLOYEE', 'IN', 'OUT'].map((option) => (
                  <button 
                    key={option} 
                    className={filter === option ? 'primary-btn' : 'secondary-btn'} 
                    onClick={() => setFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-card spacer">
              <h3>Live Attendance Records</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">No matching records found.</td>
                    </tr>
                  ) : (
                    filteredLogs.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td><strong>{item.userId?.name || 'N/A'}</strong></td>
                        <td>{item.userId?.userId || 'N/A'}</td>
                        <td>
                          {item.userId?.role ? (
                            <span className={`badge ${item.userId.role.toLowerCase()}`}>
                              {item.userId.role}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(item.createdAt).toLocaleTimeString()}</td>
                        <td>
                          <span className={`badge ${item.type === 'LOGIN' ? 'in' : 'out'}`}>
                            {item.type === 'LOGIN' ? 'IN' : 'OUT'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'STUDENTS' && (
          <div className="table-card spacer">
            <h3>Registered Students</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>User ID</th>
                  <th>Batch/Program</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No students registered yet.</td>
                  </tr>
                ) : (
                  studentsList.map((user, index) => (
                    <tr key={user.id || user._id}>
                      <td>{index + 1}</td>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.userId}</td>
                      <td>{user.batchOrDept}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'EMPLOYEES' && (
          <div className="table-card spacer">
            <h3>Registered Employees</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>User ID</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {employeesList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No employees registered yet.</td>
                  </tr>
                ) : (
                  employeesList.map((user, index) => (
                    <tr key={user.id || user._id}>
                      <td>{index + 1}</td>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.userId}</td>
                      <td>{user.batchOrDept}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
