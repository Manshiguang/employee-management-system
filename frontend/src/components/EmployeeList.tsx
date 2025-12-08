import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesApi } from '../services/api';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await employeesApi.getAll();
        setEmployees(data);
        setError('');
      } catch (err: any) {
        setError(err.message || '获取员工列表失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Get unique departments for filter
  const departments = ['', ...new Set(employees.map(emp => emp.department))];

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm)
    )
    .filter(emp => !filterDepartment || emp.department === filterDepartment)
    .sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle delete employee
  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个员工吗？')) {
      try {
        await employeesApi.delete(id);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err: any) {
        alert(err.message || '删除员工失败，请稍后重试');
        console.error(err);
      }
    }
  };

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  // Handle import
  const handleImport = async () => {
    if (!selectedFile) {
      setError('请先选择要导入的CSV文件');
      return;
    }

    try {
      setImporting(true);
      setError('');
      const result = await employeesApi.importCSV(selectedFile);
      
      // Refresh employee list
      const updatedEmployees = await employeesApi.getAll();
      setEmployees(updatedEmployees);
      
      setShowImportModal(false);
      alert(`成功导入 ${result.successCount || 0} 条员工数据，失败 ${result.failureCount || 0} 条`);
    } catch (err: any) {
      setError(err.message || '导入失败，请检查文件格式后重试');
      console.error(err);
    } finally {
      setImporting(false);
      setSelectedFile(null);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      await employeesApi.exportCSV();
    } catch (err: any) {
      alert(err.message || '导出失败，请稍后重试');
      console.error(err);
    }
  };

  return (
    <div className="employee-list">
      <div className="page-header">
        <h2>员工列表</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索员工姓名、邮箱或电话..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="">所有部门</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <Link to="/employees/new" className="btn btn-primary">
            添加员工
          </Link>
          <button
            onClick={handleExport}
            className="btn btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            导出CSV
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="btn btn-success"
            style={{ marginLeft: '10px' }}
          >
            导入CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  姓名 {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  邮箱 {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('phone')} className="sortable">
                  电话 {sortBy === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('department')} className="sortable">
                  部门 {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('position')} className="sortable">
                  职位 {sortBy === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('hireDate')} className="sortable">
                  入职日期 {sortBy === 'hireDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>{employee.hireDate}</td>
                    <td className="actions">
                      <Link to={`/employees/edit/${employee.id}`} className="btn btn-sm btn-secondary">
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="btn btn-sm btn-danger"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-data">
                    没有找到匹配的员工
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <span>显示 {filteredEmployees.length} 条记录</span>
        <div className="pagination-controls">
          <button className="btn btn-sm btn-outline" disabled>
            上一页
          </button>
          <span className="page-number">第 1 页，共 1 页</span>
          <button className="btn btn-sm btn-outline" disabled>
            下一页
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>导入员工数据</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="import-instructions">
                <h4>导入说明：</h4>
                <ul>
                  <li>请确保CSV文件包含以下字段：姓名、邮箱、电话、部门、职位、入职日期、状态</li>
                  <li>状态字段值只能是：active 或 inactive</li>
                  <li>入职日期格式：YYYY-MM-DD</li>
                </ul>
              </div>
              
              <div className="file-upload">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={importing}
                  className="file-input"
                />
                {importing && <div className="loading">导入中...</div>}
              </div>
              
              {error && <div className="error-message">{error}</div>}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="btn btn-primary"
                disabled={importing}
              >
                {importing ? '导入中...' : '开始导入'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
