@echo off
setlocal enabledelayedexpansion

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未安装Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo Node.js版本:
node --version
echo npm版本:
npm --version
echo.

REM 项目根目录
set "PROJECT_ROOT=%~dp0"

REM 启动后端服务
echo 启动后端服务...
start "后端服务" cmd /k "cd /d %PROJECT_ROOT%backend && echo 安装后端依赖... && npm install && echo 启动后端服务... && npm start"

REM 等待后端依赖安装
ping 127.0.0.1 -n 5 >nul

REM 启动前端服务
echo 启动前端服务...
start "前端服务" cmd /k "cd /d %PROJECT_ROOT%frontend && echo 安装前端依赖... && npm install && echo 启动前端服务... && npm run dev"

echo.
echo 服务启动完成！
echo 前端服务将在 http://localhost:3000 或 http://localhost:3001（如果3000端口被占用）
echo 后端服务将在 http://localhost:8080
echo 按任意键关闭此窗口...
pause >nul
