// Seed comment: This page allows administrators to scan user QR codes via a webcam, using a cooldown locking system to avoid duplicate entries.
import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import QRScanner from '../components/QRScanner';
import api from '../api/axios';

function ScanPage() {
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef(null);

  // Fetch recent scan logs on component load
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/api/attendance/logs');
        setLogs(response.data.logs.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch attendance logs:', error);
      }
    };
    fetchLogs();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleScan = async (qrToken) => {
    // If we are currently processing a scan, ignore new inputs (cooldown)
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      setStatusMessage('Processing scan...');
      setStatusType('info');
      
      const response = await api.post('/api/attendance/scan', { qrToken });
      const record = response.data.record;
      const userName = record.userId?.name || 'User';
      const action = record.type === 'LOGIN' ? 'IN' : 'OUT';

      setStatusMessage(`Scan Success! ${userName} marked ${action}.`);
      setStatusType('success');
      
      // Add the new record to the list and truncate to 5 entries
      setLogs((prev) => [record, ...prev].slice(0, 5));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Scan failed. Invalid token or server error.';
      setStatusMessage(errorMsg);
      setStatusType('error');
    } finally {
      // Clear current status message and allow new scans after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
        setIsProcessing(false);
      }, 3000);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h2>Admin Attendance Scanner</h2>
        <p className="page-subtitle">Scan student or employee QR codes below to check them in/out.</p>
        
        <QRScanner onScan={handleScan} />

        {statusMessage && (
          <div className={`toast-message ${statusType}`}>
            {statusMessage}
          </div>
        )}

        <div className="table-card spacer">
          <h3>Latest Scans (Session)</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4">No scans recorded yet.</td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item._id}>
                    <td>{item.userId?.name || 'Unknown'}</td>
                    <td>
                      <span className={`badge ${item.userId?.role === 'STUDENT' ? 'student' : 'employee'}`}>
                        {item.userId?.role || 'STUDENT'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.type === 'LOGIN' ? 'in' : 'out'}`}>
                        {item.type === 'LOGIN' ? 'IN' : 'OUT'}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScanPage;
