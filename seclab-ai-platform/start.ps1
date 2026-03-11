# 检查Node.js是否安装
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未安装Node.js，请先安装Node.js" -ForegroundColor Red
    Read-Host "按Enter键退出..."
    exit 1
}

Write-Host "Node.js版本: " -NoNewline
node --version
Write-Host "npm版本: " -NoNewline
npm --version
Write-Host ""

# 项目根目录
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# 启动后端服务
Write-Host "启动后端服务..." -ForegroundColor Green
Start-Process -FilePath powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot/backend'; Write-Host '安装后端依赖...' -ForegroundColor Cyan; npm install; Write-Host '启动后端服务...' -ForegroundColor Cyan; npm start"

# 等待后端依赖安装
Start-Sleep -Seconds 5

# 启动前端服务
Write-Host "启动前端服务..." -ForegroundColor Green
Start-Process -FilePath powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot/frontend'; Write-Host '安装前端依赖...' -ForegroundColor Cyan; npm install; Write-Host '启动前端服务...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "服务启动完成！" -ForegroundColor Green
Write-Host "前端服务将在 http://localhost:3000 或 http://localhost:3001（如果3000端口被占用）" -ForegroundColor Yellow
Write-Host "后端服务将在 http://localhost:8080" -ForegroundColor Yellow
Read-Host "按Enter键退出..."
