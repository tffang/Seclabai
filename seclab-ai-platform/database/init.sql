-- =====================================
-- SecLab AI Platform Database Init Script
-- =====================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS seclab_ai
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE seclab_ai;


-- =====================================
-- 删除旧表（避免重复创建报错）
-- =====================================

DROP TABLE IF EXISTS chat_history;
DROP TABLE IF EXISTS submission;
DROP TABLE IF EXISTS user_experiment;
DROP TABLE IF EXISTS experiment_step;
DROP TABLE IF EXISTS experiment;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS lab_environment;
DROP TABLE IF EXISTS user;


-- =====================================
-- 用户表
-- =====================================

CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    email VARCHAR(100) COMMENT '邮箱',
    role VARCHAR(20) DEFAULT 'student' COMMENT '角色 student/teacher/admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB;


-- =====================================
-- 课程表
-- =====================================

CREATE TABLE course (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '课程ID',
    name VARCHAR(100) NOT NULL COMMENT '课程名称',
    description TEXT COMMENT '课程描述',
    teacher_id BIGINT COMMENT '教师ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES user(id)
) ENGINE=InnoDB;


-- =====================================
-- 实验表
-- =====================================

CREATE TABLE experiment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '实验ID',
    course_id BIGINT COMMENT '课程ID',
    title VARCHAR(200) COMMENT '实验标题',
    description TEXT COMMENT '实验描述',
    difficulty VARCHAR(20) DEFAULT 'easy' COMMENT '难度 easy/medium/hard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(id)
) ENGINE=InnoDB;


-- =====================================
-- 实验步骤表
-- =====================================

CREATE TABLE experiment_step (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '步骤ID',
    experiment_id BIGINT,
    step_order INT COMMENT '步骤顺序',
    content TEXT COMMENT '步骤内容',
    FOREIGN KEY (experiment_id) REFERENCES experiment(id)
) ENGINE=InnoDB;


-- =====================================
-- 用户实验记录
-- =====================================

CREATE TABLE user_experiment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    experiment_id BIGINT,
    status VARCHAR(20) DEFAULT 'not_started',
    score INT DEFAULT 0,
    started_at TIMESTAMP NULL,
    finished_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (experiment_id) REFERENCES experiment(id)
) ENGINE=InnoDB;


-- =====================================
-- 实验报告提交
-- =====================================

CREATE TABLE submission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    experiment_id BIGINT,
    report TEXT COMMENT '实验报告',
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (experiment_id) REFERENCES experiment(id)
) ENGINE=InnoDB;


-- =====================================
-- AI聊天记录
-- =====================================

CREATE TABLE chat_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    message TEXT COMMENT '用户消息',
    response TEXT COMMENT 'AI回复',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB;


-- =====================================
-- 实验环境表（Docker靶场）
-- =====================================

CREATE TABLE lab_environment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    experiment_id BIGINT,
    docker_image VARCHAR(200),
    port INT,
    status VARCHAR(20) DEFAULT 'stopped',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (experiment_id) REFERENCES experiment(id)
) ENGINE=InnoDB;


-- =====================================
-- 初始化测试数据（可选）
-- =====================================

INSERT INTO user (username,password,email,role)
VALUES
('admin','admin123','admin@seclab.com','admin'),
('teacher','teacher123','teacher@seclab.com','teacher'),
('student','student123','student@seclab.com','student');


-- 查看所有表
SHOW TABLES;