// Seed comment: This page enables existing users (and bootstrapped Admins) to authenticate using email/password and saves their session.
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex-center">
      <div className="container">
        <div className="form-card">
          <div className="brand-header">
            <h2>Organization Portal</h2>
            <p>Attendance Portal</p>
          </div>
          <h3>Sign In</h3>
          <p className="form-subtitle">Sign in to view your digital ID card or scan QR codes.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input 
                id="login-email"
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="email@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input 
                id="login-password"
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                placeholder="••••••••"
              />
            </div>
            
            <button id="login-submit" className="primary-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
            
            {error && <div className="error">{error}</div>}
            
            <div className="form-footer spacer">
              Don't have an ID account? <Link to="/register" className="accent-link">Create one now</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
