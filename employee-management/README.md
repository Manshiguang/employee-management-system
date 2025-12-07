# 我的项目 - 员工信息管理系统

一个现代化的员工信息管理Web应用，支持员工信息的增删改查、批量上传、导出等功能，基于Supabase云数据库和Vercel部署平台。

## 功能特性

### 核心功能
- ✅ **员工查询** - 支持按姓名、部门、主管、大组组长、组长、身份证号、OA账号、在职状态、电话搜索
- ✅ **添加员工** - 通过表单添加新员工信息
- ✅ **删除员工** - 删除指定员工记录
- ✅ **选择性批量删除** - 可选择多个员工进行批量删除
- ✅ **更新员工** - 编辑现有员工信息
- ✅ **批量上传** - 支持Excel(.xlsx, .xls)和CSV文件批量导入
- ✅ **数据导出** - 默认导出为Excel(.xlsx)格式

### 数据字段
- 员工ID（自动生成）
- 姓名
- 部门
- 主管
- 大组组长
- 组长
- 入职时间（支持多种日期格式）
- 离职时间（支持多种日期格式）
- 身份证号
- OA账号
- 在职状态
- 业绩
- 电话
- 创建时间（自动记录）

## 部署到Vercel

### 方法一：使用Vercel CLI

1. 安装Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 登录Vercel：
   ```bash
   vercel login
   ```

3. 部署项目：
   ```bash
   vercel
   ```

4. 按照提示完成部署配置

### 方法二：通过GitHub部署

1. 将代码推送到GitHub仓库
2. 登录 [Vercel官网](https://vercel.com)
3. 点击"New Project"
4. 导入GitHub仓库
5. 配置环境变量（可选）：
   - `SUPABASE_URL`: Supabase项目URL
   - `SUPABASE_ANON_KEY`: Supabase匿名密钥
6. 点击"Deploy"

### 方法三：直接上传

1. 登录 [Vercel官网](https://vercel.com)
2. 点击"New Project"
3. 选择"Import Git Repository"或直接拖拽项目文件夹
4. 完成部署

## 环境变量配置

如果需要在Vercel中配置环境变量，可以在项目设置中添加：

- `SUPABASE_URL`: https://ynkekasnpxtnomswumuz.supabase.co
- `SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua2VrYXNucHh0bm9tc3d1bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0NDUyMzQsImV4cCI6MjA0NDAyMTIzNH0.8vJ7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7v7

## 本地开发

### 1. 启动应用
```bash
# 在employee-management目录下启动HTTP服务器
cd employee-management
# 使用Python启动服务器（如果已安装Python）
python -m http.server 8000
# 或者使用Node.js的http-server
npx http-server
```

然后在浏览器中访问：`http://localhost:8000`

### 2. 基本操作

#### 添加单个员工
1. 点击"添加员工"按钮
2. 填写员工信息表单
3. 点击"保存"按钮

#### 搜索员工
1. 在搜索框中输入关键词
2. 点击"搜索"按钮或按回车键
3. 系统将显示匹配的员工记录

#### 编辑员工
1. 在员工列表中找到目标员工
2. 点击"编辑"按钮
3. 修改信息后点击"保存"

#### 删除员工
1. 在员工列表中找到目标员工
2. 点击"删除"按钮
3. 确认删除操作

#### 导出数据
1. 点击"导出数据"按钮
2. 系统将自动下载Excel格式的数据文件

#### 批量导入员工
1. 点击"批量上传"按钮打开上传窗口
2. 在悬浮窗口中点击"下载模板"获取标准格式文件
3. 按照模板格式填写员工数据
4. 返回上传窗口，点击"选择文件"上传填写好的文件
5. 系统自动解析并导入数据

#### 选择性批量删除员工
1. 在表格中选择要删除的员工（使用复选框）
2. 点击"全选"复选框可快速选择所有员工
3. 点击"批量删除"按钮
4. 确认删除操作（将删除选中的员工数据）
5. 系统将删除选中的员工记录

### 3. 文件上传格式要求

#### Excel/CSV文件格式
文件应包含表头行，支持以下列名（中英文均可）：
- 姓名 / name
- 部门 / department  
- 主管 / supervisor
- 大组组长 / groupLeader
- 组长 / teamLeader
- 入职时间 / joinDate（支持1970/1/1、1970-1-1等格式）
- 离职时间 / leaveDate（支持1970/1/1、1970-1-1等格式）
- 身份证号 / idCard
- OA账号 / oaAccount
- 在职状态 / status
- 业绩 / performance
- 电话 / phone

#### 示例数据格式
```
姓名,部门,主管,大组组长,组长,入职时间,离职时间,身份证号,OA账号,在职状态,业绩,电话
张三,技术部,王经理,李组长,张组长,2023/1/15,,110101199001011234,zhangsan,在职,95.5,13800138000
李四,销售部,刘经理,陈组长,赵组长,2022-08-20,2024-06-30,110101199002021235,lisi,离职,88.0,13900139000
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **云数据库**: Supabase
- **表格处理**: SheetJS (xlsx.js)
- **部署平台**: Vercel
- **样式**: 响应式设计，支持移动端

## 数据存储

- **云存储**: 数据存储在Supabase云数据库
- **实时同步**: 支持多设备实时数据同步
- **数据安全**: 云端备份，数据不会丢失

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 项目结构

```
employee-management/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 核心逻辑（集成Supabase）
├── vercel.json         # Vercel部署配置
├── package.json        # 项目配置
└── README.md           # 说明文档
```

## 注意事项

1. **数据安全**: 数据存储在Supabase云数据库，安全可靠
2. **文件格式**: 批量上传仅支持.xlsx, .xls, .csv格式
3. **数据验证**: 系统会对输入数据进行有效性验证
4. **日期格式**: 支持多种日期格式自动解析
5. **重复检查**: 批量导入时会自动检查重复数据

## 开发说明

如需修改或扩展功能，请编辑对应的文件：
- 修改界面样式：编辑 `style.css`
- 修改业务逻辑：编辑 `script.js`
- 修改页面结构：编辑 `index.html`
- 修改部署配置：编辑 `vercel.json`
