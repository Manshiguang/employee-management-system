#!/bin/bash
# 员工信息管理系统 - 部署脚本
# 请按照以下步骤执行部署

echo "🚀 开始部署员工信息管理系统..."

# 步骤1: Git初始化
echo "1. 初始化Git仓库..."
git init

# 步骤2: 添加所有文件
echo "2. 添加文件到暂存区..."
git add .

# 步骤3: 提交初始版本
echo "3. 提交初始版本..."
git commit -m "Initial commit: 员工信息管理系统"

# 步骤4: 重命名主分支
echo "4. 重命名分支为main..."
git branch -M main

echo "✅ Git初始化完成！"

echo ""
echo "📋 接下来需要手动操作："
echo "1. 在GitHub创建新仓库: https://github.com/new"
echo "2. 仓库名: employee-management-system"
echo "3. 复制仓库URL"
echo "4. 执行以下命令连接远程仓库："
echo "   git remote add origin https://github.com/你的用户名/employee-management-system.git"
echo "5. 推送代码："
echo "   git push -u origin main"
echo ""
echo "🌐 然后在Vercel部署："
echo "1. 访问: https://vercel.com"
echo "2. 导入GitHub仓库"
echo "3. 点击部署"
echo "4. 获取访问URL"
echo ""
echo "🎉 部署完成！"
