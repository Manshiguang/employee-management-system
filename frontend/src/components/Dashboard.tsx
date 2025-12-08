import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <h1>员工信息管理系统</h1>
        </div>
        <div className="header-right">
          <nav className="nav-links">
            <Link to="/">首页</Link>
            <Link to="/employees">员工管理</Link>
            <Link to="/departments">部门管理</Link>
            <Link to="/roles">角色管理</Link>
            <Link to="/reports">统计报表</Link>
            <button className="btn btn-secondary" onClick={handleLogout}>
              退出登录
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
