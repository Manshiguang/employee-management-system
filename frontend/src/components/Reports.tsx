import React, { useState, useEffect } from 'react';
import { reportsApi, employeesApi, departmentsApi } from '../services/api';

interface EmployeeStats {
  total: number;
  byDepartment: Array<{ departmentId: number; departmentName: string; count: number }>;
  byPosition: Array<{ position: string; count: number }>;
  byGender: Array<{ gender: string; count: number }>;
  averageAge: number;
  averageTenure: number;
}

interface DepartmentStats {
  total: number;
  averageEmployeeCount: number;
  departmentStats: Array<{ 
    departmentId: number; 
    departmentName: string; 
    employeeCount: number;
    averageSalary: number;
    averageAge: number;
  }>;
}

const Reports: React.FC = () => {
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'employees' | 'departments'>('employees');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 并行请求员工和部门统计数据
        const [employeeData, departmentData] = await Promise.all([
          fetchEmployeeStats(),
          fetchDepartmentStats()
        ]);
        
        setEmployeeStats(employeeData);
        setDepartmentStats(departmentData);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 获取员工统计数据
  const fetchEmployeeStats = async (): Promise<EmployeeStats> => {
    try {
      return await reportsApi.getEmployeeStats();
    } catch (err) {
      console.error('Error fetching employee stats:', err);
      // 使用模拟数据作为回退
      return {
        total: 100,
        byDepartment: [
          { departmentId: 1, departmentName: '技术部', count: 45 },
          { departmentId: 2, departmentName: '市场部', count: 20 },
          { departmentId: 3, departmentName: '销售部', count: 15 },
          { departmentId: 4, departmentName: '人事部', count: 10 },
          { departmentId: 5, departmentName: '财务部', count: 10 }
        ],
        byPosition: [
          { position: '前端开发工程师', count: 15 },
          { position: '后端开发工程师', count: 18 },
          { position: 'UI/UX设计师', count: 7 },
          { position: '产品经理', count: 5 },
          { position: '市场营销经理', count: 10 },
          { position: '销售代表', count: 15 },
          { position: '人事专员', count: 8 },
          { position: '财务经理', count: 5 },
          { position: '行政助理', count: 4 },
          { position: '客服专员', count: 3 }
        ],
        byGender: [
          { gender: '男', count: 65 },
          { gender: '女', count: 35 }
        ],
        averageAge: 32,
        averageTenure: 2.5
      };
    }
  };

  // 获取部门统计数据
  const fetchDepartmentStats = async (): Promise<DepartmentStats> => {
    try {
      return await reportsApi.getDepartmentStats();
    } catch (err) {
      console.error('Error fetching department stats:', err);
      // 使用模拟数据作为回退
      return {
        total: 5,
        averageEmployeeCount: 20,
        departmentStats: [
          { departmentId: 1, departmentName: '技术部', employeeCount: 45, averageSalary: 12000, averageAge: 30 },
          { departmentId: 2, departmentName: '市场部', employeeCount: 20, averageSalary: 10000, averageAge: 32 },
          { departmentId: 3, departmentName: '销售部', employeeCount: 15, averageSalary: 9000, averageAge: 33 },
          { departmentId: 4, departmentName: '人事部', employeeCount: 10, averageSalary: 8000, averageAge: 35 },
          { departmentId: 5, departmentName: '财务部', employeeCount: 10, averageSalary: 8500, averageAge: 34 }
        ]
      };
    }
  };

  // 简单的柱状图渲染
  const renderBarChart = (data: Array<{ name: string; value: number }>, color: string = 'bg-blue-500') => {
    const maxValue = Math.max(...data.map(item => item.value), 1);
    
    return (
      <div className="h-80 p-4 bg-white rounded-lg shadow">
        {data.map((item, index) => (
          <div key={index} className="flex items-end justify-center gap-2 mb-4">
            <div className="flex flex-col items-center flex-1">
              <div 
                className={`w-full rounded-t transition-all duration-300 ${color}`}
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '20px'
                }}
              />
              <div className="mt-2 text-sm font-medium text-gray-700">{item.value}</div>
            </div>
            <div className="text-xs text-gray-500 rotate-90 origin-bottom-left whitespace-nowrap min-w-[60px]">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">加载统计数据中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">统计报表</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 标签页 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('employees')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'employees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            员工统计
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'departments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            部门统计
          </button>
        </nav>
      </div>

      {/* 员工统计标签页 */}
      {activeTab === 'employees' && employeeStats && (
        <div className="space-y-8">
          {/* 员工总数概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">总员工数</div>
              <div className="text-2xl font-bold text-gray-900">{employeeStats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">平均年龄</div>
              <div className="text-2xl font-bold text-gray-900">{employeeStats.averageAge.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">平均司龄(年)</div>
              <div className="text-2xl font-bold text-gray-900">{employeeStats.averageTenure.toFixed(1)}</div>
            </div>
          </div>

          {/* 员工按部门分布 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">员工按部门分布</h2>
            {renderBarChart(
              employeeStats.byDepartment.map(dept => ({
                name: dept.departmentName,
                value: dept.count
              })),
              'bg-blue-500'
            )}
          </div>

          {/* 员工按职位分布 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">员工按职位分布</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">职位</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">人数</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">占比</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeStats.byPosition.map((position, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{position.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{position.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {((position.count / employeeStats.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 员工按性别分布 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">员工按性别分布</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {employeeStats.byGender.map((gender, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
                  <div className="text-4xl font-bold text-gray-900">{gender.count}</div>
                  <div className="text-sm text-gray-500 mt-2">{gender.gender}性</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {((gender.count / employeeStats.total) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 部门统计标签页 */}
      {activeTab === 'departments' && departmentStats && (
        <div className="space-y-8">
          {/* 部门总数概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">总部门数</div>
              <div className="text-2xl font-bold text-gray-900">{departmentStats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">平均部门人数</div>
              <div className="text-2xl font-bold text-gray-900">{departmentStats.averageEmployeeCount.toFixed(1)}</div>
            </div>
          </div>

          {/* 部门员工数量分布 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">部门员工数量分布</h2>
            {renderBarChart(
              departmentStats.departmentStats.map(dept => ({
                name: dept.departmentName,
                value: dept.employeeCount
              })),
              'bg-green-500'
            )}
          </div>

          {/* 部门详细统计 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">部门详细统计</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部门名称</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">员工人数</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">平均薪资</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">平均年龄</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentStats.departmentStats.map((dept, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.departmentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{dept.employeeCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ¥{dept.averageSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {dept.averageAge.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;