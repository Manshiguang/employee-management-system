// Supabase配置
const supabaseUrl = 'https://ynkekasnpxtnomswumuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua2VrYXNucHh0bm9tc3d1bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0NDUyMzQsImV4cCI6MjA0NDAyMTIzNH0.8vJ7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7';

// 确保Supabase库已加载
if (typeof supabase === 'undefined') {
    console.error('Supabase库未加载，请检查CDN连接');
    alert('Supabase库加载失败，请刷新页面重试');
}

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

class EmployeeManager {
    constructor() {
        this.employees = [];
        this.currentEditId = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadEmployees();
        this.renderTable();
    }

    bindEvents() {
        // 添加员工按钮
        document.getElementById('addBtn').addEventListener('click', () => {
            this.showModal('添加员工');
        });

        // 批量上传按钮 - 显示上传悬浮窗口
        document.getElementById('uploadBtn').addEventListener('click', () => {
            this.showUploadModal();
        });

        // 导出数据按钮
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // 下载模板按钮
        document.getElementById('downloadTemplateBtn').addEventListener('click', () => {
            this.downloadTemplate();
        });

        // 选择文件按钮
        document.getElementById('selectFileBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        // 文件上传处理
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
            this.hideUploadModal(); // 上传完成后关闭悬浮窗口
        });

        // 上传悬浮窗口关闭按钮
        document.getElementById('closeUploadModal').addEventListener('click', () => {
            this.hideUploadModal();
        });

        // 全选复选框
        document.getElementById('selectAll').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.employee-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });

        // 批量删除按钮
        document.getElementById('batchDeleteBtn').addEventListener('click', () => {
            this.batchDeleteEmployees();
        });

        // 点击上传悬浮窗口外部关闭
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('uploadModal');
            if (e.target === modal) {
                this.hideUploadModal();
            }
        });

        // 搜索功能
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchEmployees();
        });

        // 搜索输入框回车事件
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchEmployees();
            }
        });

        // 模态框关闭
        document.querySelector('.close').addEventListener('click', () => {
            this.hideModal();
        });

        // 取消按钮
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideModal();
        });

        // 表单提交
        document.getElementById('employeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('employeeModal');
            if (e.target === modal) {
                this.hideModal();
            }
        });
    }

    async loadEmployees() {
        try {
            const { data, error } = await supabaseClient
                .from('employees')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading employees:', error);
                this.showMessage('加载员工数据失败', 'error');
                return [];
            }
            
            this.employees = data || [];
            return this.employees;
        } catch (error) {
            console.error('Error loading employees:', error);
            this.showMessage('加载员工数据失败', 'error');
            return [];
        }
    }

    async saveEmployeeToSupabase(employeeData) {
        try {
            if (this.currentEditId) {
                // 更新员工
                const { data, error } = await supabaseClient
                    .from('employees')
                    .update(employeeData)
                    .eq('id', this.currentEditId);
                
                if (error) throw error;
                return data;
            } else {
                // 添加新员工
                const { data, error } = await supabaseClient
                    .from('employees')
                    .insert([employeeData])
                    .select();
                
                if (error) throw error;
                return data?.[0];
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            throw error;
        }
    }

    showModal(title, employee = null) {
        document.getElementById('modalTitle').textContent = title;
        const modal = document.getElementById('employeeModal');
        modal.style.display = 'block';

        if (employee) {
            // 编辑模式
            this.currentEditId = employee.id;
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('name').value = employee.name || '';
            document.getElementById('department').value = employee.department || '';
            document.getElementById('supervisor').value = employee.supervisor || '';
            document.getElementById('groupLeader').value = employee.groupLeader || '';
            document.getElementById('teamLeader').value = employee.teamLeader || '';
            document.getElementById('joinDate').value = employee.joinDate || '';
            document.getElementById('leaveDate').value = employee.leaveDate || '';
            document.getElementById('idCard').value = employee.idCard || '';
            document.getElementById('oaAccount').value = employee.oaAccount || '';
            document.getElementById('status').value = employee.status || '在职';
            document.getElementById('performance').value = employee.performance || '';
            document.getElementById('phone').value = employee.phone || '';
        } else {
            // 添加模式
            this.currentEditId = null;
            document.getElementById('employeeForm').reset();
            document.getElementById('employeeId').value = '';
            document.getElementById('status').value = '在职';
        }
    }

    hideModal() {
        document.getElementById('employeeModal').style.display = 'none';
        this.currentEditId = null;
    }

    showUploadModal() {
        document.getElementById('uploadModal').style.display = 'block';
    }

    hideUploadModal() {
        document.getElementById('uploadModal').style.display = 'none';
    }

    /**
     * 获取表单数据并验证
     */
    getFormData() {
        const form = document.getElementById('employeeForm');
        const formData = new FormData(form);
        
        return {
            name: this.getInputValue('name'),
            department: this.getInputValue('department'),
            supervisor: this.getInputValue('supervisor'),
            groupLeader: this.getInputValue('groupLeader'),
            teamLeader: this.getInputValue('teamLeader'),
            joinDate: this.getInputValue('joinDate'),
            leaveDate: this.getInputValue('leaveDate'),
            idCard: this.getInputValue('idCard'),
            oaAccount: this.getInputValue('oaAccount'),
            status: this.getInputValue('status'),
            performance: parseFloat(this.getInputValue('performance')) || 0,
            phone: this.getInputValue('phone')
        };
    }

    /**
     * 获取输入框值
     */
    getInputValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    }

    /**
     * 保存员工信息
     */
    async saveEmployee() {
        // 显示加载状态
        this.setFormLoading(true);
        
        try {
            const employeeData = this.getFormData();

            // 验证数据
            const validationResult = this.validateEmployee(employeeData);
            if (!validationResult.isValid) {
                this.showMessage(validationResult.message, 'error');
                return;
            }

            // 保存到Supabase
            const savedEmployee = await this.saveEmployeeToSupabase(employeeData);
            
            if (savedEmployee) {
                // 重新加载并更新界面
                await this.refreshEmployeeData();
                this.hideModal();
                
                const action = this.currentEditId ? '更新' : '添加';
                this.showMessage(`${action}员工成功！`, 'success');
            }
        } catch (error) {
            console.error('保存员工失败:', error);
            this.handleSaveError(error);
        } finally {
            // 移除加载状态
            this.setFormLoading(false);
        }
    }

    /**
     * 设置表单加载状态
     */
    setFormLoading(loading) {
        const submitBtn = document.querySelector('#employeeForm button[type="submit"]');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> 保存中...';
            cancelBtn.disabled = true;
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = '保存';
            cancelBtn.disabled = false;
        }
    }

    /**
     * 刷新员工数据
     */
    async refreshEmployeeData() {
        await this.loadEmployees();
        this.renderTable();
    }

    /**
     * 处理保存错误
     */
    handleSaveError(error) {
        let errorMessage = '操作失败，请重试';
        
        if (error.message.includes('duplicate')) {
            errorMessage = '员工信息已存在（身份证号或电话重复）';
        } else if (error.message.includes('network')) {
            errorMessage = '网络连接失败，请检查网络后重试';
        } else if (error.message.includes('auth')) {
            errorMessage = '认证失败，请刷新页面重试';
        }
        
        this.showMessage(errorMessage, 'error');
    }

    /**
     * 增强的数据验证
     */
    validateEmployee(data) {
        if (!data.name.trim()) {
            return { isValid: false, message: '请输入员工姓名' };
        }
        
        if (!data.department.trim()) {
            return { isValid: false, message: '请输入部门名称' };
        }

        // 姓名长度验证
        if (data.name.length > 50) {
            return { isValid: false, message: '姓名长度不能超过50个字符' };
        }

        // 电话格式验证
        if (data.phone && !this.isValidPhone(data.phone)) {
            return { isValid: false, message: '请输入有效的手机号码' };
        }

        // 身份证号格式验证
        if (data.idCard && !this.isValidIdCard(data.idCard)) {
            return { isValid: false, message: '请输入有效的身份证号码' };
        }

        // 邮箱格式验证（如果添加邮箱字段）
        if (data.email && !this.isValidEmail(data.email)) {
            return { isValid: false, message: '请输入有效的邮箱地址' };
        }

        // 业绩数值验证
        if (data.performance < 0) {
            return { isValid: false, message: '业绩不能为负数' };
        }

        return { isValid: true, message: '' };
    }

    /**
     * 验证手机号码格式
     */
    isValidPhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    /**
     * 验证邮箱格式
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidIdCard(idCard) {
        // 简单的身份证号验证（15位或18位数字，最后一位可以是X）
        const idCardRegex = /^(\d{15}|\d{17}[\dXx])$/;
        return idCardRegex.test(idCard);
    }

    parseDate(dateString) {
        if (!dateString || dateString.trim() === '') {
            return '';
        }
        
        // 尝试解析不同的日期格式
        let date;
        
        // 格式1: 1970/1/1
        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // 月份从0开始
                const day = parseInt(parts[2]);
                date = new Date(year, month, day);
            }
        }
        // 格式2: 1970-1-1
        else if (dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // 月份从0开始
                const day = parseInt(parts[2]);
                date = new Date(year, month, day);
            }
        }
        // 格式3: 直接使用Date构造函数
        else {
            date = new Date(dateString);
        }
        
        // 检查日期是否有效
        if (date && !isNaN(date.getTime())) {
            return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
        }
        
        // 如果无法解析，返回空字符串
        return '';
    }

    async deleteEmployee(id) {
        if (confirm('确定要删除这个员工吗？此操作不可撤销。')) {
            try {
                const { error } = await supabaseClient
                    .from('employees')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                
                // 重新加载数据
                await this.loadEmployees();
                this.renderTable();
                this.showMessage('员工删除成功！', 'success');
            } catch (error) {
                console.error('Error deleting employee:', error);
                this.showMessage('删除员工失败: ' + error.message, 'error');
            }
        }
    }

    getSelectedEmployeeIds() {
        const checkboxes = document.querySelectorAll('.employee-checkbox:checked');
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    }

    async batchDeleteEmployees() {
        const selectedIds = this.getSelectedEmployeeIds();
        
        if (selectedIds.length === 0) {
            this.showMessage('请先选择要删除的员工', 'warning');
            return;
        }

        if (confirm(`确定要删除选中的 ${selectedIds.length} 名员工吗？此操作不可撤销。`)) {
            try {
                const { error } = await supabaseClient
                    .from('employees')
                    .delete()
                    .in('id', selectedIds);
                
                if (error) throw error;
                
                // 重新加载数据
                await this.loadEmployees();
                this.renderTable();
                this.showMessage(`成功删除 ${selectedIds.length} 名员工`, 'success');
                
                // 重置全选复选框
                document.getElementById('selectAll').checked = false;
            } catch (error) {
                console.error('Error batch deleting employees:', error);
                this.showMessage('批量删除员工失败: ' + error.message, 'error');
            }
        }
    }

    editEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (employee) {
            this.showModal('编辑员工', employee);
        }
    }

    searchEmployees() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        
        if (!searchTerm) {
            this.renderTable();
            return;
        }

        const filteredEmployees = this.employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm) ||
            (emp.supervisor && emp.supervisor.toLowerCase().includes(searchTerm)) ||
            (emp.groupLeader && emp.groupLeader.toLowerCase().includes(searchTerm)) ||
            (emp.teamLeader && emp.teamLeader.toLowerCase().includes(searchTerm)) ||
            (emp.idCard && emp.idCard.includes(searchTerm)) ||
            (emp.oaAccount && emp.oaAccount.toLowerCase().includes(searchTerm)) ||
            (emp.status && emp.status.toLowerCase().includes(searchTerm)) ||
            emp.phone.includes(searchTerm)
        );

        this.renderTable(filteredEmployees);
    }

    renderTable(employees = null) {
        const tbody = document.getElementById('employeeTableBody');
        const data = employees || this.employees;
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; padding: 40px; color: #6c757d;">暂无员工数据</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(emp => `
            <tr>
                <td><input type="checkbox" class="employee-checkbox" value="${emp.id}"></td>
                <td>${emp.id}</td>
                <td>${this.escapeHtml(emp.name)}</td>
                <td>${this.escapeHtml(emp.department)}</td>
                <td>${this.escapeHtml(emp.supervisor || '')}</td>
                <td>${this.escapeHtml(emp.groupLeader || '')}</td>
                <td>${this.escapeHtml(emp.teamLeader || '')}</td>
                <td>${emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('zh-CN') : ''}</td>
                <td>${emp.leaveDate ? new Date(emp.leaveDate).toLocaleDateString('zh-CN') : ''}</td>
                <td>${this.escapeHtml(emp.idCard || '')}</td>
                <td>${this.escapeHtml(emp.oaAccount || '')}</td>
                <td>${this.escapeHtml(emp.status || '在职')}</td>
                <td>${emp.performance ? emp.performance.toLocaleString() : ''}</td>
                <td>${this.escapeHtml(emp.phone)}</td>
                <td class="actions">
                    <button class="btn btn-warning" onclick="employeeManager.editEmployee('${emp.id}')">✏️ 编辑</button>
                    <button class="btn btn-danger" onclick="employeeManager.deleteEmployee('${emp.id}')">🗑️ 删除</button>
                </td>
            </tr>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 检查文件类型
        const validTypes = ['.xlsx', '.xls', '.csv'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            this.showMessage('请上传Excel(.xlsx, .xls)或CSV文件', 'error');
            return;
        }

        try {
            const employees = await this.parseFile(file, fileExtension);
            if (employees && employees.length > 0) {
                this.processUploadedEmployees(employees);
            }
        } catch (error) {
            this.showMessage('文件解析失败: ' + error.message, 'error');
        }

        // 清空文件输入
        event.target.value = '';
    }

    async parseFile(file, extension) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    let employees = [];
                    
                    if (extension === '.csv') {
                        employees = this.parseCSV(e.target.result);
                    } else {
                        employees = this.parseExcel(e.target.result);
                    }
                    
                    resolve(employees);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            
            if (extension === '.csv') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    parseExcel(data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        return this.parseTableData(jsonData);
    }

    parseCSV(data) {
        const lines = data.split('\n').filter(line => line.trim());
        const jsonData = lines.map(line => line.split(',').map(cell => cell.trim()));
        
        return this.parseTableData(jsonData);
    }

    parseTableData(data) {
        if (data.length < 2) {
            throw new Error('文件内容为空或格式不正确');
        }

        const headers = data[0].map(header => header.toLowerCase());
        const employees = [];

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length === 0 || row.every(cell => !cell)) continue;

            const employee = {};
            
            // 尝试匹配列名
            headers.forEach((header, index) => {
                const value = row[index] || '';
                if (header.includes('姓名') || header.includes('name')) {
                    employee.name = value;
                } else if (header.includes('部门') || header.includes('department')) {
                    employee.department = value;
                } else if (header.includes('主管') || header.includes('supervisor')) {
                    employee.supervisor = value;
                } else if (header.includes('大组组长') || header.includes('groupleader')) {
                    employee.groupLeader = value;
                } else if (header.includes('组长') || header.includes('teamleader')) {
                    employee.teamLeader = value;
                } else if (header.includes('入职时间') || header.includes('joindate')) {
                    employee.joinDate = this.parseDate(value);
                } else if (header.includes('离职时间') || header.includes('leavedate')) {
                    employee.leaveDate = this.parseDate(value);
                } else if (header.includes('身份证号') || header.includes('idcard')) {
                    employee.idCard = value;
                } else if (header.includes('oa账号') || header.includes('oaaccount')) {
                    employee.oaAccount = value;
                } else if (header.includes('在职状态') || header.includes('status')) {
                    employee.status = value;
                } else if (header.includes('业绩') || header.includes('performance')) {
                    employee.performance = parseFloat(value) || 0;
                } else if (header.includes('电话') || header.includes('phone')) {
                    employee.phone = value;
                }
            });

            // 验证必要字段
            if (employee.name && employee.department) {
                employee.id = Date.now().toString() + i;
                employee.createTime = new Date().toISOString();
                employees.push(employee);
            }
        }

        return employees;
    }

    async processUploadedEmployees(newEmployees) {
        const validEmployees = newEmployees.filter(emp => 
            emp.name && emp.department
        );

        if (validEmployees.length === 0) {
            this.showMessage('未找到有效的员工数据，请检查文件格式', 'error');
            return;
        }

        try {
            // 批量插入到Supabase
            const { data, error } = await supabaseClient
                .from('employees')
                .insert(validEmployees)
                .select();

            if (error) throw error;

            // 重新加载数据
            await this.loadEmployees();
            this.renderTable();
            
            let message = `成功导入 ${validEmployees.length} 名员工`;
            this.showMessage(message, 'success');
        } catch (error) {
            console.error('Error uploading employees:', error);
            
            // 检查是否是重复数据错误
            if (error.message.includes('duplicate')) {
                this.showMessage('导入失败：存在重复数据，请检查身份证号或电话号码是否重复', 'error');
            } else {
                this.showMessage('导入失败: ' + error.message, 'error');
            }
        }
    }

    exportData() {
        if (this.employees.length === 0) {
            this.showMessage('没有数据可导出', 'warning');
            return;
        }

        // 默认直接导出Excel格式
        try {
            this.exportToExcel();
        } catch (error) {
            this.showMessage('导出失败: ' + error.message, 'error');
        }
    }

    exportToExcel() {
        // 准备数据
        const data = this.employees.map(emp => ({
            '员工ID': emp.id,
            '姓名': emp.name,
            '部门': emp.department,
            '主管': emp.supervisor || '',
            '大组组长': emp.groupLeader || '',
            '组长': emp.teamLeader || '',
            '入职时间': emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('zh-CN') : '',
            '离职时间': emp.leaveDate ? new Date(emp.leaveDate).toLocaleDateString('zh-CN') : '',
            '身份证号': emp.idCard || '',
            'OA账号': emp.oaAccount || '',
            '在职状态': emp.status || '在职',
            '业绩': emp.performance || '',
            '电话': emp.phone,
            '创建时间': new Date(emp.createTime).toLocaleString('zh-CN')
        }));

        // 创建工作簿
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '员工数据');

        // 生成文件名
        const fileName = `员工数据_${new Date().toISOString().split('T')[0]}.xlsx`;

        // 导出文件
        XLSX.writeFile(workbook, fileName);
        this.showMessage(`数据已成功导出为 ${fileName}`, 'success');
    }

    exportToCSV() {
        // CSV表头
        const headers = ['员工ID', '姓名', '部门', '主管', '大组组长', '组长', '入职时间', '离职时间', '身份证号', 'OA账号', '在职状态', '业绩', '电话', '创建时间'];
        
        // 转换数据为CSV格式
        const csvData = this.employees.map(emp => [
            emp.id,
            `"${emp.name}"`,
            `"${emp.department}"`,
            `"${emp.supervisor || ''}"`,
            `"${emp.groupLeader || ''}"`,
            `"${emp.teamLeader || ''}"`,
            emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('zh-CN') : '',
            emp.leaveDate ? new Date(emp.leaveDate).toLocaleDateString('zh-CN') : '',
            `"${emp.idCard || ''}"`,
            `"${emp.oaAccount || ''}"`,
            `"${emp.status || '在职'}"`,
            emp.performance || '',
            `"${emp.phone}"`,
            new Date(emp.createTime).toLocaleString('zh-CN')
        ]);

        // 合并表头和数据
        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        // 创建下载链接
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `员工数据_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('数据已成功导出为CSV文件', 'success');
    }

    downloadTemplate() {
        // 创建模板数据 - 只保留字段名
        const templateData = [
            ['姓名', '部门', '主管', '大组组长', '组长', '入职时间', '离职时间', '身份证号', 'OA账号', '在职状态', '业绩', '电话']
        ];

        // 创建工作簿
        const worksheet = XLSX.utils.aoa_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '员工模板');

        // 生成文件名
        const fileName = `员工信息上传模板_${new Date().toISOString().split('T')[0]}.xlsx`;

        // 导出文件
        XLSX.writeFile(workbook, fileName);
        this.showMessage(`模板已成功下载为 ${fileName}`, 'success');
    }

    showMessage(message, type = 'info') {
        // 移除现有消息
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        const backgroundColor = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        }[type];

        messageDiv.style.backgroundColor = backgroundColor;

        document.body.appendChild(messageDiv);

        // 3秒后自动消失
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 3000);

        // 添加动画样式
        if (!document.querySelector('#messageStyles')) {
            const style = document.createElement('style');
            style.id = 'messageStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 初始化应用
const employeeManager = new EmployeeManager();
