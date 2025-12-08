import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call login API
      const response = await authApi.login(username, password);
      
      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      navigate('/');
    } catch (err: any) {
      console.error('API login failed, trying mock login:', err);
      
      // Mock login if API fails (for demo purposes)
      if (username === 'admin' && password === 'admin') {
        // Generate mock token and user info
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: '1',
          name: '管理员',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        // Store mock data
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Redirect to dashboard
        navigate('/');
        return;
      }
      
      // If not using mock credentials, show error
      setError(err.message || '登录失败，请使用用户名: admin, 密码: admin 进行演示登录');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>员工信息管理系统</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
};

export default Login;
