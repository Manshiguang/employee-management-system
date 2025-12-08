// API service layer for handling backend communication

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000';

// Common headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic error handler
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '请求失败，请稍后重试');
  }
  return response.json();
};

// Authentication API
export const authApi = {
  // Login user
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Logout user (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current logged-in user
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
};

// Employees API
export const employeesApi = {
  // Get all employees
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get employee by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Create new employee
  create: async (employeeData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  // Update employee
  update: async (id: string, employeeData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  // Delete employee
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get employees by department
  getByDepartment: async (departmentId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/employees/department/${departmentId}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Export employees as CSV
  exportCSV: async () => {
    const response = await fetch(`${API_BASE_URL}/api/employees/export`, {
      method: 'GET',
      headers: {
        ...getHeaders(),
        'Accept': 'text/csv',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '导出失败，请稍后重试');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  },

  // Import employees from CSV
  importCSV: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/employees/import`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': undefined, // Let browser set it with boundary
      },
      body: formData,
    });
    
    return handleResponse(response);
  },
};

// Departments API
export const departmentsApi = {
  // Get all departments
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/departments`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get department by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Create new department
  create: async (departmentData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(departmentData),
    });
    return handleResponse(response);
  },

  // Update department
  update: async (id: string, departmentData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(departmentData),
    });
    return handleResponse(response);
  },

  // Delete department
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Permissions API
export const permissionsApi = {
  // Get all permissions
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/permissions`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get permission by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/permissions/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Create new permission
  create: async (permissionData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/permissions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(permissionData),
    });
    return handleResponse(response);
  },

  // Update permission
  update: async (id: string, permissionData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/permissions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(permissionData),
    });
    return handleResponse(response);
  },

  // Delete permission
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/permissions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Roles API
export const rolesApi = {
  // Get all roles
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get role by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Create new role
  create: async (roleData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(roleData),
    });
    return handleResponse(response);
  },

  // Update role
  update: async (id: string, roleData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(roleData),
    });
    return handleResponse(response);
  },

  // Delete role
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Reports API
export const reportsApi = {
  // Get employee statistics
  getEmployeeStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/reports/employee-stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get department statistics
  getDepartmentStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/reports/department-stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get attendance report
  getAttendanceReport: async (startDate: string, endDate: string) => {
    const response = await fetch(`${API_BASE_URL}/api/reports/attendance?startDate=${startDate}&endDate=${endDate}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Statistics API for dashboard
export const statsApi = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    // Use employee stats and department stats to get dashboard data
    const [employeeStats, departmentStats] = await Promise.all([
      reportsApi.getEmployeeStats(),
      reportsApi.getDepartmentStats()
    ]);
    
    return {
      totalEmployees: employeeStats.total || 0,
      departments: departmentStats.total || 0,
      activeEmployees: Math.floor((employeeStats.total || 0) * 0.75), // Simulate active employees
    };
  },
  
  // Get recent activities
  getRecentActivities: async () => {
    // Since there's no direct API for this, return mock data
    return [
      { id: 1, action: '创建了新员工', name: '张三', time: '刚刚', icon: '👤' },
      { id: 2, action: '更新了部门信息', name: '李四', time: '5分钟前', icon: '🏢' },
      { id: 3, action: '修改了员工薪资', name: '王五', time: '1小时前', icon: '💰' },
      { id: 4, action: '添加了新部门', name: '赵六', time: '2小时前', icon: '📋' },
      { id: 5, action: '更新了员工职位', name: '孙七', time: '3小时前', icon: '📈' },
    ];
  },
};
