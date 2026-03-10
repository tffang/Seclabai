const mysql = require('mysql2/promise');
const config = require('./db-config');

// 创建数据库连接池
const pool = mysql.createPool({
  ...config
});

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

// 执行SQL查询
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('SQL查询失败:', error);
    throw error;
  }
}

// 关闭数据库连接池
async function closePool() {
  try {
    await pool.end();
    console.log('数据库连接池已关闭');
  } catch (error) {
    console.error('关闭数据库连接池失败:', error);
    throw error;
  }
}

// 更新用户表结构
async function updateUsersTable() {
  try {
    // 检查并添加studentId字段
    const studentIdCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "user" AND COLUMN_NAME = "studentId"');
    if (studentIdCheck[0].count === 0) {
      // 先添加允许NULL的字段
      await query('ALTER TABLE user ADD COLUMN studentId VARCHAR(20) UNIQUE COMMENT "学号"');
      // 为现有记录设置默认值
      await query('UPDATE user SET studentId = CONCAT("USER_", id) WHERE studentId IS NULL');
    }
    
    // 确保studentId字段是NOT NULL的
    const studentIdNullCheck = await query('SELECT COUNT(*) AS count FROM user WHERE studentId IS NULL');
    if (studentIdNullCheck[0].count > 0) {
      // 为任何NULL值设置默认值
      await query('UPDATE user SET studentId = CONCAT("USER_", id) WHERE studentId IS NULL');
    }
    
    // 最后修改为NOT NULL
    await query('ALTER TABLE user MODIFY COLUMN studentId VARCHAR(20) NOT NULL UNIQUE COMMENT "学号"');
    
    // 检查并添加name字段
    const nameCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "user" AND COLUMN_NAME = "name"');
    if (nameCheck[0].count === 0) {
      // 先添加允许NULL的字段
      await query('ALTER TABLE user ADD COLUMN name VARCHAR(50) COMMENT "姓名"');
      // 为现有记录设置默认值
      await query('UPDATE user SET name = CONCAT("用户_", id) WHERE name IS NULL');
      // 然后修改为NOT NULL
      await query('ALTER TABLE user MODIFY COLUMN name VARCHAR(50) NOT NULL COMMENT "姓名"');
    } else {
      // 检查现有记录是否有NULL值
      const nullNameCheck = await query('SELECT COUNT(*) AS count FROM user WHERE name IS NULL');
      if (nullNameCheck[0].count > 0) {
        // 为现有记录设置默认值
        await query('UPDATE user SET name = CONCAT("用户_", id) WHERE name IS NULL');
      }
      // 然后修改为NOT NULL
      await query('ALTER TABLE user MODIFY COLUMN name VARCHAR(50) NOT NULL COMMENT "姓名"');
    }
    
    // 检查并添加gender字段
    const genderCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "user" AND COLUMN_NAME = "gender"');
    if (genderCheck[0].count === 0) {
      await query('ALTER TABLE user ADD COLUMN gender VARCHAR(10) COMMENT "性别"');
      // 为现有记录设置默认值
      await query('UPDATE user SET gender = "男" WHERE gender IS NULL');
    }
    
    // 删除不需要的字段（如果存在）
    const emailCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "user" AND COLUMN_NAME = "email"');
    if (emailCheck[0].count > 0) {
      await query('ALTER TABLE user DROP COLUMN email');
    }
    
    console.log('用户表结构更新成功');
  } catch (error) {
    console.error('更新用户表结构失败:', error);
    throw error;
  }
}

// 创建用户表
async function createUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS user (
      id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
      username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
      studentId VARCHAR(20) NOT NULL UNIQUE COMMENT '学号',
      name VARCHAR(50) NOT NULL COMMENT '姓名',
      password VARCHAR(255) NOT NULL COMMENT '密码',
      gender VARCHAR(10) COMMENT '性别',
      role VARCHAR(20) DEFAULT 'student' COMMENT '角色 student/teacher/admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  
  try {
    await query(sql);
    console.log('用户表创建成功或已存在');
    
    // 创建表后更新结构，确保字段约束正确
    await updateUsersTable();
  } catch (error) {
    console.error('创建用户表失败:', error);
    throw error;
  }
}

// 插入默认数据
async function insertDefaultData() {
  // 检查是否已有数据
  const countSql = 'SELECT COUNT(*) AS count FROM user';
  const countResult = await query(countSql);
  
  if (countResult[0].count === 0) {
    const defaultUsers = [
      {
        username: 'admin',
        studentId: 'admin001',
        name: '管理员',
        password: 'admin123',
        gender: '男',
        role: 'admin'
      },
      {
        username: 'teacher',
        studentId: 'teacher001',
        name: '教师',
        password: 'teacher123',
        gender: '男',
        role: 'teacher'
      },
      {
        username: 'student',
        studentId: '2023001',
        name: '学生',
        password: 'student123',
        gender: '男',
        role: 'student'
      }
    ];
    
    const insertSql = `
      INSERT INTO user (username, studentId, name, password, gender, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    for (const user of defaultUsers) {
      await query(insertSql, [
        user.username, user.studentId, user.name, user.password, user.gender, user.role
      ]);
    }
    
    console.log('默认数据插入成功');
  } else {
    console.log('数据库中已有数据，跳过默认数据插入');
  }
}

// 更新课程表结构
async function updateCourseTable() {
  try {
    // 检查并添加视频相关字段
    const videoCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "video_url"');
    if (videoCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN video_url VARCHAR(255) COMMENT "课程视频URL"');
    }
    
    const videoCoverCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "video_cover"');
    if (videoCoverCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN video_cover VARCHAR(255) COMMENT "视频封面图URL"');
    }
    
    const videoDurationCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "video_duration"');
    if (videoDurationCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN video_duration INT COMMENT "视频时长（秒）"');
    }
    
    const progressCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "progress"');
    if (progressCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN progress INT DEFAULT 0 COMMENT "学习进度（百分比）"');
    }
    
    const studentsCountCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "students_count"');
    if (studentsCountCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN students_count INT DEFAULT 0 COMMENT "学习人数"');
    }
    
    const ratingCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "rating"');
    if (ratingCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN rating DECIMAL(3,1) DEFAULT 0 COMMENT "课程评分"');
    }
    
    const categoryCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "category"');
    if (categoryCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN category VARCHAR(50) COMMENT "课程分类"');
    }
    
    const durationCheck = await query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "course" AND COLUMN_NAME = "duration"');
    if (durationCheck[0].count === 0) {
      await query('ALTER TABLE course ADD COLUMN duration VARCHAR(20) COMMENT "课程总时长"');
    }
    
    console.log('课程表结构更新成功');
  } catch (error) {
    console.error('更新课程表结构失败:', error);
    throw error;
  }
}

// 创建课程表
async function createCourseTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS course (
      id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '课程ID',
      name VARCHAR(100) NOT NULL COMMENT '课程名称',
      description TEXT COMMENT '课程描述',
      teacher_id BIGINT COMMENT '教师ID',
      video_url VARCHAR(255) COMMENT '课程视频URL',
      video_cover VARCHAR(255) COMMENT '视频封面图URL',
      video_duration INT COMMENT '视频时长（秒）',
      progress INT DEFAULT 0 COMMENT '学习进度（百分比）',
      students_count INT DEFAULT 0 COMMENT '学习人数',
      rating DECIMAL(3,1) DEFAULT 0 COMMENT '课程评分',
      category VARCHAR(50) COMMENT '课程分类',
      duration VARCHAR(20) COMMENT '课程总时长',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES user(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  
  try {
    await query(sql);
    console.log('课程表创建成功或已存在');
    
    // 创建表后更新结构，确保字段约束正确
    await updateCourseTable();
  } catch (error) {
    console.error('创建课程表失败:', error);
    throw error;
  }
}

module.exports = {
  testConnection,
  query,
  closePool,
  createUsersTable,
  updateUsersTable,
  insertDefaultData,
  createCourseTable,
  updateCourseTable
};
