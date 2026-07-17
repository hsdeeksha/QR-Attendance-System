// Seed comment: This page provides a registration form with dynamic labels based on roles, handles form submission with loading states, and automatically logs in and redirects on success.
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    role: 'STUDENT',
    batchOrDept: '',
    validUntil: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFormData({ ...formData, photo: dataUrl });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Auto register logs the user in and updates the token/user state in AuthContext
      const payload = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`
      };
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="form-card">
          <h2>Create Account</h2>
          <p className="form-subtitle">Register a new student or employee ID.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input 
                id="reg-name"
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input 
                id="reg-email"
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  name="countryCode" 
                  value={formData.countryCode} 
                  onChange={handleChange}
                  style={{ width: '80px', flexShrink: 0 }}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                </select>
                <input 
                  id="reg-phone"
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  placeholder="98765 43210"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input 
                id="reg-password"
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-role">Role</label>
              <select 
                id="reg-role"
                name="role" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-batchDept">
                {formData.role === 'STUDENT' ? 'Batch' : 'Department'}
              </label>
              <input 
                id="reg-batchDept"
                name="batchOrDept" 
                value={formData.batchOrDept} 
                onChange={handleChange} 
                required 
                placeholder={formData.role === 'STUDENT' ? 'e.g. SEO-2024' : 'e.g. Finance'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-validUntil">Valid Until</label>
              <input 
                id="reg-validUntil"
                name="validUntil" 
                value={formData.validUntil} 
                onChange={handleChange} 
                placeholder="e.g. December 2026" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-photo">Profile Photo</label>
              <input 
                id="reg-photo"
                type="file" 
                accept="image/*"
                onChange={handlePhotoUpload} 
              />
            </div>
            
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
            
            {error && <div className="error">{error}</div>}
            
            <div className="form-footer spacer">
              Already have an account? <Link to="/login" className="accent-link">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
