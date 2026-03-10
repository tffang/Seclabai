# SecLab AI Platform

SecLab AI Platform 是一个面向网络安全教学与实验的智能化实验平台。本项目旨在结合 **AI 辅助学习、网络安全实验环境与实验管理系统**，为学生提供一个集 **学习、实验、评估与智能问答** 于一体的综合平台。

该项目目前处于开发阶段，作为毕业设计项目持续迭代。

---

# 项目目标

构建一个现代化的网络安全实验平台，提供以下能力：

* 网络安全实验课程管理
* 实验任务发布与管理
* 学生实验进度记录
* AI 实验助手与问答系统
* 实验报告记录与评估
* 实验数据管理
* 用户权限与角色管理

---

# 技术栈

## 后端

* Node.js
* Express.js
* MySQL
* RESTful API

## 前端

* Vue 3
* Vite
* Axios
* Element Plus
* Pinia (状态管理)
* Vue Router

## 其他技术

* Git + GitHub
* Docker（计划用于实验环境）

---

# 项目结构

```
seclab-ai-platform
│
├── backend
│   ├── server.js              # 后端主入口文件
│   ├── db-config.js           # 数据库配置
│   ├── db.js                  # 数据库连接管理
│   ├── package.json           # 后端依赖
│   └── node_modules           # 后端依赖安装目录
│
├── frontend
│   ├── src
│   │   ├── assets             # 静态资源
│   │   ├── components         # 公共组件
│   │   ├── pages              # 页面组件
│   │   │   ├── Access         # 登录注册页面
│   │   │   ├── Student        # 学生端页面
│   │   │   ├── Teacher        # 教师端页面
│   │   │   └── Admin          # 管理员端页面
│   │   ├── router             # 路由配置
│   │   ├── store              # 状态管理
│   │   ├── api                # API 接口
│   │   └── main.js            # 前端主入口文件
│   ├── index.html             # HTML 模板
│   ├── package.json           # 前端依赖
│   ├── vite.config.js         # Vite 配置
│   └── node_modules           # 前端依赖安装目录
│
└── README.md                  # 项目说明文档
```

---

# 核心功能

## 1. 用户与权限管理

* 学生、教师、管理员角色分离
* 用户注册、登录、登出功能
* 密码加密存储
* 基于角色的权限控制

## 2. 课程管理

* 课程列表展示
* 课程详情查看
* 课程视频播放

## 3. 学生管理

* 学生列表查询与分页
* 学生信息添加、编辑、删除
* 学生搜索与筛选功能

## 4. 实验管理

* 实验列表展示
* 实验详情查看

---

# 当前开发进度

* [x] 项目基础结构初始化
* [x] 后端 API 框架搭建
* [x] 前端项目框架搭建
* [x] 用户登录与权限管理系统
* [x] 学生端课程浏览功能
* [x] 教师端学生管理功能
* [x] 数据库设计与实现
* [ ] AI 实验助手模块
* [ ] 实验环境管理模块
* [ ] 实验报告提交与评分系统

---

# 未来计划

后续将逐步实现以下功能：

* AI 安全学习助手
* 实验报告提交与评分系统
* Docker 靶场环境管理
* 实验进度跟踪与统计
* 更多网络安全实验场景

---

# 运行说明

## 环境要求

* Node.js >= 14.0.0
* MySQL >= 5.7.0

## 后端启动

1. 进入 backend 目录
2. 安装依赖：
   ```bash
   npm install
   ```
3. 配置数据库信息（在 db-config.js 文件中）
4. 启动后端服务：
   ```bash
   node server.js
   ```
5. 后端服务将运行在 http://localhost:8080

## 前端启动

1. 进入 frontend 目录
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动前端开发服务器：
   ```bash
   npm run dev
   ```
4. 前端服务将运行在 http://localhost:3000（或其他可用端口）

---

# 项目状态

当前版本：

```
v0.2 (Core Features Implemented)
```

项目正在持续开发中。

---

# License

This project is for educational and research purposes.
