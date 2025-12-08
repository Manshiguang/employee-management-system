import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { departmentsApi } from '../services/api';

interface Department {
  id?: number;
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

const DepartmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Department>({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchDepartment = async () => {
        try {
          setLoading(true);
          const department = await departmentsApi.getDepartmentById(Number(id));
          setFormData(department);
          setErrors({});
        } catch (err) {
          console.error('Error fetching department:', err);
          alert('Failed to load department data. Please try again.');
          navigate('/departments');
        } finally {
          setLoading(false);
        }
      };

      fetchDepartment();
    }
  }, [id, navigate, isEditing]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '部门名称不能为空';
    } else if (formData.name.length < 2) {
      newErrors.name = '部门名称至少需要2个字符';
    }

    if (!formData.description.trim()) {
      newErrors.description = '部门描述不能为空';
    } else if (formData.description.length < 5) {
      newErrors.description = '部门描述至少需要5个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除字段错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      if (isEditing && id) {
        await departmentsApi.updateDepartment(Number(id), formData);
        alert('部门信息更新成功');
      } else {
        await departmentsApi.createDepartment(formData);
        alert('部门创建成功');
      }
      
      navigate('/departments');
    } catch (err) {
      console.error('Error saving department:', err);
      alert(`操作失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/departments');
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? '编辑部门' : '添加部门'}</h1>
        <button 
          onClick={handleCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
        >
          取消
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              部门名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="输入部门名称"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              部门描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="输入部门描述"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;