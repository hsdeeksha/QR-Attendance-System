// Seed comment: This component renders the navigation bar with role-based access control, hiding menus for unauthenticated users.
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => user ? navigate('/dashboard') : navigate('/login')} style={{ cursor: 'pointer' }}>
        QR Attendance
      </div>
      {user && (
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          {user.role !== 'ADMIN' && (
            <Link to="/card" className="nav-link">My Card</Link>
          )}
          {user.role === 'ADMIN' && (
            <>
              <Link to="/scan" className="nav-link">Scanner</Link>
              <Link to="/admin" className="nav-link">Admin</Link>
            </>
          )}
          <button className="nav-btn secondary-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
