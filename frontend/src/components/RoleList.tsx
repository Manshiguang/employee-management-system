import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rolesApi } from '../services/api';

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
}

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const data = await rolesApi.getAll();
        setRoles(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load roles. Please try again later.');
        // 使用模拟数据作为回退
        setRoles([
          {
            id: 1,
            name: '管理员',
            description: '拥有系统所有权限',
            permissions: [
              { id: 1, name: 'user_manage', description: '用户管理' },
              { id: 2, name: 'department_manage', description: '部门管理' },
              { id: 3, name: 'role_manage', description: '角色管理' },
              { id: 4, name: 'report_view', description: '报表查看' }
            ],
            userCount: 2,
            createdAt: '2023-01-01'
          },
          {
            id: 2,
            name: '部门经理',
            description: '管理部门员工',
            permissions: [
              { id: 1, name: 'user_manage', description: '用户管理' }
            ],
            userCount: 5,
            createdAt: '2023-01-10'
          },
          {
            id: 3,
            name: '普通员工',
            description: '只能查看个人信息',
            permissions: [],
            userCount: 50,
            createdAt: '2023-01-15'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个角色吗？删除后相关用户将失去此角色权限。')) {
      try {
        await rolesApi.delete(id.toString());
        setRoles(roles.filter(role => role.id !== id));
      } catch (err) {
        console.error('Error deleting role:', err);
        alert('删除角色失败，请稍后重试。');
      }
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-8">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Link 
          to="/roles/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
        >
          添加角色
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索角色名称或描述..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">权限数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRoles.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{role.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{role.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{role.permissions.length}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{role.userCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(role.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/roles/edit/${role.id}`} 
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    编辑
                  </Link>
                  <button 
                    onClick={() => handleDelete(role.id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRoles.length === 0 && (
        <div className="mt-6 text-center text-gray-500">
          没有找到匹配的角色
        </div>
      )}
    </div>
  );
};

export default RoleList;