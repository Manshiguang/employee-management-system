// API service layer for handling backend communication

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

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
