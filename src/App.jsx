// This file defines the main routes for the attendance app.
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import CardPage from './pages/CardPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ScanPage from './pages/ScanPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/card" element={<ProtectedRoute><CardPage /></ProtectedRoute>} />
      <Route path="/scan" element={<ProtectedRoute role="ADMIN"><ScanPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
