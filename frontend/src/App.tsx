import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home';

// Import components
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import DepartmentList from './components/DepartmentList';
import DepartmentForm from './components/DepartmentForm';

// Import future components
import RoleList from './components/RoleList';
import RoleForm from './components/RoleForm';
import Reports from './components/Reports';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/new" element={<DepartmentForm />} />
            <Route path="departments/edit/:id" element={<DepartmentForm />} />
            <Route path="roles" element={<RoleList />} />
            <Route path="roles/new" element={<RoleForm />} />
            <Route path="roles/edit/:id" element={<RoleForm />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<div>Welcome to Dashboard</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
