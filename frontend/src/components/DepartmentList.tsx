import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentsApi } from '../services/api';

interface Department {
  id: number;
  name: string;
  description: string;
  employeeCount: number;
  createdAt: string;
}

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await departmentsApi.getDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments. Please try again later.');
        // 使用模拟数据作为回退
        setDepartments([
          { id: 1, name: '人力资源部', description: '负责公司人力资源管理', employeeCount: 5, createdAt: '2023-01-15' },
          { id: 2, name: '技术部', description: '负责公司技术研发', employeeCount: 20, createdAt: '2023-01-10' },
          { id: 3, name: '市场部', description: '负责公司市场营销', employeeCount: 8, createdAt: '2023-02-01' },
          { id: 4, name: '财务部', description: '负责公司财务管理', employeeCount: 4, createdAt: '2023-01-20' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个部门吗？删除后相关员工信息将不受影响。')) {
      try {
        await departmentsApi.deleteDepartment(id);
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (err) {
        console.error('Error deleting department:', err);
        alert('删除部门失败，请稍后重试。');
      }
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-8">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">部门管理</h1>
        <Link 
          to="/departments/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
        >
          添加部门
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
          placeholder="搜索部门名称或描述..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部门名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">员工数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDepartments.map((department) => (
              <tr key={department.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{department.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{department.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{department.employeeCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(department.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/departments/edit/${department.id}`} 
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    编辑
                  </Link>
                  <button 
                    onClick={() => handleDelete(department.id)} 
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

      {filteredDepartments.length === 0 && (
        <div className="mt-6 text-center text-gray-500">
          没有找到匹配的部门
        </div>
      )}
    </div>
  );
};

export default DepartmentList;