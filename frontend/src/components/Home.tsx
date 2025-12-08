import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '../services/api';

interface Stat {
  id: number;
  title: string;
  value: number;
  color: string;
  link: string;
}

interface Activity {
  id: number;
  action: string;
  name: string;
  time: string;
  icon: string;
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await statsApi.getDashboardStats();
        const activitiesData = await statsApi.getRecentActivities();
        
        // Transform API data to match expected format
        const formattedStats: Stat[] = [
          { id: 1, title: '总员工数', value: statsData.totalEmployees, color: '#3498db', link: '/employees' },
          { id: 2, title: '部门数', value: statsData.departments, color: '#2ecc71', link: '/departments' },
          { id: 3, title: '当前在线', value: statsData.activeEmployees, color: '#e74c3c', link: '#' },
          { id: 4, title: '本月新员工', value: 15, color: '#f39c12', link: '/employees' },
        ];
        
        const formattedActivities: Activity[] = activitiesData.map((activity: any, index: number) => ({
          id: index + 1,
          action: activity.action,
          name: activity.name,
          time: activity.time,
          icon: activity.icon || '📝'
        }));
        
        setStats(formattedStats);
        setRecentActivities(formattedActivities);
        setError('');
      } catch (err: any) {
        setError(err.message || '获取数据失败');
        console.error(err);
        
        // Fallback to mock data if API fails
        setStats([
          { id: 1, title: '总员工数', value: 500, color: '#3498db', link: '/employees' },
          { id: 2, title: '部门数', value: 20, color: '#2ecc71', link: '/departments' },
          { id: 3, title: '当前在线', value: 120, color: '#e74c3c', link: '#' },
          { id: 4, title: '本月新员工', value: 15, color: '#f39c12', link: '/employees' },
        ]);
        
        setRecentActivities([
          { id: 1, action: '的个人信息已更新', name: '张三', time: '2分钟前', icon: '📝' },
          { id: 2, action: '新员工', name: '李四', time: '15分钟前', icon: '➕' },
          { id: 3, action: '已调往技术部门', name: '王五', time: '1小时前', icon: '🏢' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <h2>欢迎使用员工信息管理系统</h2>
      
      {loading ? (
        <div className="loading">加载中...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="dashboard-stats">
            {stats.map((stat) => (
              <div key={stat.id} className="stat-card">
                <h3>{stat.title}</h3>
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                {stat.link !== '#' && (
                  <Link to={stat.link} className="stat-link">
                    查看详情 →
                  </Link>
                )}
              </div>
            ))}
          </div>

      <div className="quick-actions">
        <h3>快速操作</h3>
        <div className="action-cards">
          <Link to="/employees/new" className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#3498db' }}>
              <span>+</span>
            </div>
            <div className="action-content">
              <h4>添加新员工</h4>
              <p>快速创建新的员工记录</p>
            </div>
          </Link>
          
          <Link to="/departments" className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#2ecc71' }}>
              <span>🏢</span>
            </div>
            <div className="action-content">
              <h4>管理部门</h4>
              <p>查看和管理公司部门结构</p>
            </div>
          </Link>
          
          <Link to="/roles" className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#9b59b6' }}>
              <span>👤</span>
            </div>
            <div className="action-content">
              <h4>管理角色</h4>
              <p>配置用户角色和权限</p>
            </div>
          </Link>
          
          <Link to="/reports" className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#f39c12' }}>
              <span>📊</span>
            </div>
            <div className="action-content">
              <h4>查看报表</h4>
              <p>生成和查看统计报表</p>
            </div>
          </Link>
        </div>
      </div>

          <div className="recent-activities">
            <h3>最近活动</h3>
            <div className="activity-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p>{activity.action} <strong>{activity.name}</strong></p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activities">暂无最近活动</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
