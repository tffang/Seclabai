# Seclabai
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

---

# 技术栈

## 后端

* Java
* Spring Boot
* MyBatis
* MySQL

## 前端

* Vue 3
* Vite
* Axios
* Element Plus（计划）

## 其他技术

* RESTful API
* Git + GitHub
* Docker（计划用于实验环境）

---

# 项目结构

```
seclab-ai-platform
│
├── backend
│   └── src
│       └── main
│           └── resources
│               ├── application.yml
│               └── mapper
│
├── frontend
│   ├── package.json
│   └── vite.config.js
│
├── database
│   ├── init.sql
│   └── tables
│       ├── user.sql
│       ├── course.sql
│       ├── experiment.sql
│       ├── user_experiment.sql
│       └── chat_history.sql
│
└── README.md
```

---

# 数据库设计

当前已设计基础数据表：

| 表名              | 说明      |
| --------------- | ------- |
| user            | 用户信息    |
| course          | 课程信息    |
| experiment      | 实验信息    |
| user_experiment | 用户实验记录  |
| chat_history    | AI 对话记录 |

数据库初始化脚本：

```
database/init.sql
```

---

# 当前开发进度

* [x] 项目基础结构初始化
* [x] GitHub 仓库建立
* [x] 数据库基础表设计
* [ ] 后端接口开发
* [ ] 前端页面开发
* [ ] AI 实验助手模块
* [ ] 实验环境管理模块

---

# 未来计划

后续将逐步实现以下功能：

* 用户登录与权限管理
* 实验课程管理
* AI 安全学习助手
* 实验报告提交
* 实验评分系统
* Docker 靶场环境管理

---

# 运行说明

## 后端

进入 backend 目录运行：

```
mvn spring-boot:run
```

## 前端

进入 frontend 目录运行：

```
npm install
npm run dev
```

---

# 项目状态

当前版本：

```
v0.1 (Initial Project Setup)
```

项目正在持续开发中。

---

# License

This project is for educational and research purposes.
