import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rolesApi, permissionsApi } from '../services/api';

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface RoleFormData {
  name: string;
  description: string;
  permissionIds: number[];
}

const RoleForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissionIds: []
  });
  
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 获取权限列表
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const data = await permissionsApi.getAll();
        setPermissions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError('Failed to load permissions. Please try again later.');
        // 使用模拟数据作为回退
        setPermissions([
          { id: 1, name: 'user_manage', description: '用户管理' },
          { id: 2, name: 'department_manage', description: '部门管理' },
          { id: 3, name: 'role_manage', description: '角色管理' },
          { id: 4, name: 'report_view', description: '报表查看' },
          { id: 5, name: 'system_config', description: '系统配置' },
          { id: 6, name: 'import_export', description: '导入导出' }
        ]);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  // 如果是编辑模式，获取角色详情
  useEffect(() => {
    const fetchRole = async () => {
      if (id) {
        try {
          setLoading(true);
          const role = await rolesApi.getById(id);
          setFormData({
            name: role.name,
            description: role.description,
            permissionIds: role.permissions.map(p => p.id)
          });
          setError(null);
        } catch (err) {
          console.error('Error fetching role:', err);
          setError('Failed to load role details. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRole();
  }, [id]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = '角色名称不能为空';
    }
    
    if (formData.name.length < 2 || formData.name.length > 20) {
      errors.name = '角色名称长度应在2-20个字符之间';
    }
    
    if (!formData.description.trim()) {
      errors.description = '角色描述不能为空';
    }
    
    if (formData.description.length < 5 || formData.description.length > 100) {
      errors.description = '角色描述长度应在5-100个字符之间';
    }
    
    if (formData.permissionIds.length === 0) {
      errors.permissions = '至少需要选择一个权限';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionChange = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
    if (formErrors.permissions) {
      setFormErrors(prev => ({ ...prev, permissions: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      if (id) {
        // 更新现有角色
        await rolesApi.update(id, formData);
        alert('角色更新成功');
      } else {
        // 创建新角色
        await rolesApi.create(formData);
        alert('角色创建成功');
      }
      
      navigate('/roles');
    } catch (err) {
      console.error('Error saving role:', err);
      setError('保存角色失败，请稍后重试。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {id ? '编辑角色' : '添加角色'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                角色名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="请输入角色名称"
                disabled={saving}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                角色描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="请输入角色描述"
                disabled={saving}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                角色权限 <span className="text-red-500">*</span>
              </label>
              
              {loadingPermissions ? (
                <div className="text-gray-500">加载权限中...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissions.map(permission => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        checked={formData.permissionIds.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={saving}
                      />
                      <label 
                        htmlFor={`permission-${permission.id}`} 
                        className="ml-2 block text-sm text-gray-700 cursor-pointer"
                      >
                        {permission.description}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {formErrors.permissions && (
                <p className="mt-2 text-sm text-red-500">{formErrors.permissions}</p>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/roles')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={saving}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? '保存中...' : (id ? '更新角色' : '创建角色')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;