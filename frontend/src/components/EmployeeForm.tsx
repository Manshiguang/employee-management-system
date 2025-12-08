import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeesApi, departmentsApi } from '../services/api';

// Mock data for positions
const positions = [
  '前端开发工程师', '后端开发工程师', 'UI/UX设计师', '产品经理',
  '市场营销经理', '销售代表', '人事专员', '财务经理',
  '行政助理', '客服专员', '运维工程师', '测试工程师'
];

interface Department {
  id: number;
  name: string;
  description: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive';
  address: string;
  dateOfBirth: string;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  dateOfBirth: string;
}

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    status: 'active',
    address: '',
    dateOfBirth: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    dateOfBirth: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // Check if in edit mode
  const isEditMode = !!id;

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const data = await departmentsApi.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        // Use mock data as fallback
        setDepartments([
          { id: 1, name: '技术部', description: '负责公司技术研发' },
          { id: 2, name: '市场部', description: '负责公司市场营销' },
          { id: 3, name: '人事部', description: '负责公司人力资源管理' },
          { id: 4, name: '财务部', description: '负责公司财务管理' },
          { id: 5, name: '后勤部', description: '负责公司后勤保障' },
        ]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Load employee data for edit mode
  useEffect(() => {
    const fetchEmployee = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const employee = await employeesApi.getById(id);
          if (employee) {
            const { id: _, ...employeeData } = employee;
            setFormData(employeeData);
          } else {
            navigate('/employees');
          }
          setError('');
        } catch (err: any) {
          setError(err.message || '获取员工信息失败');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEmployee();
  }, [id, isEditMode, navigate]);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = '请输入员工姓名';
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入电话号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }
    if (!formData.department) newErrors.department = '请选择部门';
    if (!formData.position) newErrors.position = '请选择职位';
    if (!formData.hireDate) newErrors.hireDate = '请选择入职日期';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = '请选择出生日期';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        if (isEditMode && id) {
          await employeesApi.update(id, formData);
        } else {
          await employeesApi.create(formData);
        }
        setError('');
        navigate('/employees');
      } catch (err: any) {
        setError(err.message || '提交失败，请稍后重试');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/employees');
  };

  return (
    <div className="employee-form">
      <div className="page-header">
        <h2>{isEditMode ? '编辑员工信息' : '添加新员工'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
      {error && <div className="error-message">{error}</div>}
        <div className="form-section">
          <h3>基本信息</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">姓名 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">邮箱 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">电话号码 *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth">出生日期 *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="department">部门 *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'error' : ''}
                disabled={loadingDepartments}
              >
                <option value="">请选择部门</option>
                {loadingDepartments ? (
                  <option value="">加载中...</option>
                ) : (
                  departments.map(dept => (
                    <option key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </option>
                  ))
                )}
              </select>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="position">职位 *</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={errors.position ? 'error' : ''}
              >
                <option value="">请选择职位</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
              {errors.position && <span className="error-message">{errors.position}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="hireDate">入职日期 *</label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                className={errors.hireDate ? 'error' : ''}
              />
              {errors.hireDate && <span className="error-message">{errors.hireDate}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="status">状态</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">在职</option>
                <option value="inactive">离职</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>详细信息</h3>
          
          <div className="form-group">
            <label htmlFor="address">地址</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (isEditMode ? '更新中...' : '添加中...') : (isEditMode ? '更新员工信息' : '添加员工')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
