const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// 导入数据库模块
const db = require('./db');

const app = express();
const port = 8080;

// 配置中间件
app.use(cors());
app.use(bodyParser.json({ charset: 'utf-8' }));
app.use(bodyParser.urlencoded({ extended: true, charset: 'utf-8' }));

// 设置默认字符编码
app.set('json spaces', 2);
app.set('json replacer', null);
app.set('json escape', false);

// 添加响应头，确保返回UTF-8编码
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 初始化数据库
async function initDatabase() {
  try {
    // 测试数据库连接
    await db.testConnection();
    // 创建用户表
    await db.createUsersTable();
    // 创建课程表
    await db.createCourseTable();
    // 插入默认数据
    await db.insertDefaultData();
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    // 如果数据库连接失败，可以考虑使用文件系统作为后备
    console.log('尝试使用文件系统作为数据存储');
  }
}

// 调用数据库初始化函数
initDatabase();

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

// 确保uploads目录存在
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 注册API
app.post('/api/auth/register', async (req, res) => {
  // 只打印非敏感信息，保护用户隐私
  const { studentId, name, password, gender } = req.body;
  console.log('收到注册请求:', { studentId, name }); // 不打印密码
  
  // 检查必填字段
  if (!studentId || !name || !password) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  try {
    // 使用学号作为用户名
    const username = studentId;
    
    // 检查用户名是否已存在（即学号是否已存在）
    const checkSql = 'SELECT * FROM user WHERE username = ? OR studentId = ?';
    const existingUser = await db.query(checkSql, [username, studentId]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: '学号已存在'
      });
    }
    
    // 创建新用户
    const insertSql = `
      INSERT INTO user (username, studentId, name, password, gender, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(insertSql, [
      username, studentId, name, password, gender, 'student'
    ]);
    
    console.log('新用户已添加到数据库，ID:', result.insertId);
    
    res.status(200).json({
      success: true,
      message: '注册成功'
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    });
  }
});

// 登录API
app.post('/api/auth/login', async (req, res) => {
  console.log('收到登录请求:', req.body);
  
  const { username, studentId, password, role } = req.body;
  
  console.log('查找用户:', { username, studentId, role }); // 移除密码，保护用户隐私
  
  try {
    let sql, params;
    
    // 根据角色选择不同的查询字段
    if (role === 'student') {
      // 学生使用学号登录
      if (!studentId || !password) {
        return res.status(400).json({
          success: false,
          message: '缺少学号或密码'
        });
      }
      sql = 'SELECT * FROM user WHERE studentId = ? AND password = ?';
      params = [studentId, password];
    } else {
      // 管理员/教师使用用户名登录
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '缺少用户名或密码'
        });
      }
      sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
      params = [username, password];
    }
    
    // 查找用户
    const result = await db.query(sql, params);
    
    if (result.length === 0) {
      console.log('登录失败: 用户名/学号或密码错误');
      return res.status(401).json({
        success: false,
        message: '用户名/学号或密码错误'
      });
    }
    
    let user = result[0];
    
    console.log('找到的用户ID和角色:', { id: user.id, username: user.username, role: user.role }); // 只打印必要的非敏感信息
    
    // 检查角色是否匹配
    if (user && role && user.role !== role) {
      console.log('角色不匹配:', { expected: role, actual: user.role }); // 保留角色信息，但使用更清晰的格式
      return res.status(401).json({
        success: false,
        message: '用户名/学号或密码错误'
      });
    }
    
    // 生成token
    const token = uuidv4();
    
    // 返回用户信息和token
    const userInfo = {
      id: user.id,
      username: user.username,
      studentId: user.studentId,
      name: user.name,
      role: user.role,
      gender: user.gender
    };
    
    res.status(200).json({
      success: true,
      data: {
        user: userInfo,
        token: token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
});

// 获取当前用户信息API
app.get('/api/user/me', async (req, res) => {
  // 这里应该检查token，但由于是模拟，直接返回ID为2的用户（测试学生）
  try {
    const sql = 'SELECT * FROM user WHERE id = ?';
    const result = await db.query(sql, [2]);
    
    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      });
    }
    
    const user = result[0];
    
    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      // 为了兼容前端组件，添加前端期望的字段
      name: user.name || user.username, // 使用user.name或username作为name
      studentId: user.studentId || user.username, // 使用user.studentId或username作为studentId
      gender: user.gender || '男', // 使用user.gender或默认值
      avatar: user.avatar || null // 如果有头像则返回，否则返回null
    };
    
    res.status(200).json({
      success: true,
      data: userInfo
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败，请稍后重试'
    });
  }
});

// 更新用户信息API
app.put('/api/user/me', async (req, res) => {
  const { name, studentId, gender } = req.body;
  
  // 这里应该检查token，但由于是模拟，直接更新ID为2的用户
  try {
    // 更新用户信息
    const sql = `
      UPDATE user SET 
        name = IFNULL(?, name),
        studentId = IFNULL(?, studentId),
        gender = IFNULL(?, gender)
      WHERE id = ?
    `;
    
    await db.query(sql, [name, studentId, gender, 2]);
    
    // 获取更新后的用户信息
    const selectSql = 'SELECT * FROM user WHERE id = ?';
    const result = await db.query(selectSql, [2]);
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    const user = result[0];
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败，请稍后重试'
    });
  }
});

// 修改密码API
app.put('/api/user/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  // 这里应该检查token，但由于是模拟，直接使用ID为2的用户
  try {
    // 检查原密码是否正确
    const checkSql = 'SELECT * FROM user WHERE id = ? AND password = ?';
    const checkResult = await db.query(checkSql, [2, oldPassword]);
    
    if (checkResult.length === 0) {
      return res.status(400).json({
        success: false,
        message: '原密码错误'
      });
    }
    
    // 更新密码
    const updateSql = 'UPDATE user SET password = ? WHERE id = ?';
    await db.query(updateSql, [newPassword, 2]);
    
    res.status(200).json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败，请稍后重试'
    });
  }
});

// 上传头像API
app.post('/api/user/upload-avatar', upload.single('file'), async (req, res) => {
  // 这里应该检查token，但由于是模拟，直接使用ID为2的用户
  try {
    // 尝试添加avatar字段（如果不存在）
    try {
      await db.query('ALTER TABLE user ADD COLUMN avatar VARCHAR(255) DEFAULT NULL');
    } catch (e) {
      // 字段可能已存在，忽略错误
      console.log('Avatar column may already exist:', e.message);
    }
    
    // 检查用户是否存在
    const checkSql = 'SELECT * FROM user WHERE id = ?';
    const checkResult = await db.query(checkSql, [2]);
    
    if (checkResult.length === 0) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      });
    }
    
    // 模拟上传成功，返回头像URL
    const avatarUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    
    // 更新用户头像
    const updateSql = 'UPDATE user SET avatar = ? WHERE id = ?';
    await db.query(updateSql, [avatarUrl, 2]);
    
    res.status(200).json({
      success: true,
      data: {
        avatar: avatarUrl
      }
    });
  } catch (error) {
    console.error('上传头像失败:', error);
    res.status(500).json({
      success: false,
      message: '上传头像失败，请稍后重试'
    });
  }
});

// 上传课程视频API
app.post('/api/courses/:id/upload-video', upload.single('video'), async (req, res) => {
  const courseId = req.params.id;
  
  try {
    // 检查课程是否存在
    const checkSql = 'SELECT * FROM course WHERE id = ?';
    const checkResult = await db.query(checkSql, [courseId]);
    
    if (checkResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }
    
    // 生成视频URL
    const videoUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    
    // 更新课程视频信息
    const updateSql = 'UPDATE course SET video_url = ? WHERE id = ?';
    await db.query(updateSql, [videoUrl, courseId]);
    
    res.status(200).json({
      success: true,
      data: {
        videoUrl: videoUrl
      }
    });
  } catch (error) {
    console.error('上传课程视频失败:', error);
    res.status(500).json({
      success: false,
      message: '上传课程视频失败，请稍后重试'
    });
  }
});

// 上传课程视频封面API
app.post('/api/courses/:id/upload-cover', upload.single('cover'), async (req, res) => {
  const courseId = req.params.id;
  
  try {
    // 检查课程是否存在
    const checkSql = 'SELECT * FROM course WHERE id = ?';
    const checkResult = await db.query(checkSql, [courseId]);
    
    if (checkResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }
    
    // 生成封面URL
    const coverUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    
    // 更新课程封面信息
    const updateSql = 'UPDATE course SET video_cover = ? WHERE id = ?';
    await db.query(updateSql, [coverUrl, courseId]);
    
    res.status(200).json({
      success: true,
      data: {
        coverUrl: coverUrl
      }
    });
  } catch (error) {
    console.error('上传课程视频封面失败:', error);
    res.status(500).json({
      success: false,
      message: '上传课程视频封面失败，请稍后重试'
    });
  }
});

// 提供静态文件服务
app.use('/uploads', express.static('uploads'));

// 获取学习统计API
app.get('/api/user/learning-stats', (req, res) => {
  // 模拟学习统计数据
  res.status(200).json({
    success: true,
    data: {
      completedCourses: Math.floor(Math.random() * 10) + 1,
      totalScore: Math.floor(Math.random() * 100) + 60,
      ranking: Math.floor(Math.random() * 50) + 1,
      consecutiveDays: Math.floor(Math.random() * 30) + 1
    }
  });
});

// 创建课程API（用于测试）
app.post('/api/courses', async (req, res) => {
  const { name, description, teacher_id, category, duration } = req.body;
  
  try {
    const insertSql = `
      INSERT INTO course (name, description, teacher_id, category, duration)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(insertSql, [name, description, teacher_id, category, duration]);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        description,
        teacher_id,
        category,
        duration
      }
    });
  } catch (error) {
    console.error('创建课程失败:', error);
    res.status(500).json({
      success: false,
      message: '创建课程失败，请稍后重试'
    });
  }
});

// 获取所有课程API
app.get('/api/courses', async (req, res) => {
  try {
    const sql = 'SELECT * FROM course';
    const courses = await db.query(sql);
    
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('获取课程列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取课程列表失败，请稍后重试'
    });
  }
});

// 获取课程详情API
app.get('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  
  try {
    const sql = 'SELECT * FROM course WHERE id = ?';
    const result = await db.query(sql, [courseId]);
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }
    
    const course = result[0];
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('获取课程详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取课程详情失败，请稍后重试'
    });
  }
});

// 更新课程API
app.put('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  const { name, description, video_url, video_cover, video_duration, category, duration } = req.body;
  
  try {
    // 检查课程是否存在
    const checkSql = 'SELECT * FROM course WHERE id = ?';
    const checkResult = await db.query(checkSql, [courseId]);
    
    if (checkResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      });
    }
    
    // 更新课程信息
    const updateSql = `
      UPDATE course SET 
        name = IFNULL(?, name),
        description = IFNULL(?, description),
        video_url = IFNULL(?, video_url),
        video_cover = IFNULL(?, video_cover),
        video_duration = IFNULL(?, video_duration),
        category = IFNULL(?, category),
        duration = IFNULL(?, duration)
      WHERE id = ?
    `;
    
    await db.query(updateSql, [name, description, video_url, video_cover, video_duration, category, duration, courseId]);
    
    // 获取更新后的课程信息
    const selectSql = 'SELECT * FROM course WHERE id = ?';
    const result = await db.query(selectSql, [courseId]);
    
    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('更新课程失败:', error);
    res.status(500).json({
      success: false,
      message: '更新课程失败，请稍后重试'
    });
  }
});

// 获取学生列表API
app.get('/api/students', async (req, res) => {
  // 确保page和pageSize是数字类型
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const { keyword, classId, status } = req.query;
  
  try {
    let sql = `SELECT id, username, studentId, name, gender, created_at FROM user WHERE role = 'student'`;
    let countSql = `SELECT COUNT(*) AS count FROM user WHERE role = 'student'`;
    const params = [];
    const countParams = [];
    
    // 添加搜索条件
    if (keyword) {
      sql += ` AND (name LIKE ? OR studentId LIKE ?)`;
      countSql += ` AND (name LIKE ? OR studentId LIKE ?)`;
      const likeKeyword = `%${keyword}%`;
      params.push(likeKeyword, likeKeyword);
      countParams.push(likeKeyword, likeKeyword);
    }
    
    // 添加班级筛选（这里使用studentId的前缀来模拟班级）
    if (classId) {
      sql += ` AND studentId LIKE ?`;
      countSql += ` AND studentId LIKE ?`;
      params.push(`${classId}%`);
      countParams.push(`${classId}%`);
    }
    
    // 添加状态筛选（这里使用role来模拟状态，实际应该添加status字段）
    if (status) {
      // 这里简化处理，active表示正常，disabled表示禁用
      if (status === 'disabled') {
        sql += ` AND role = 'disabled'`;
        countSql += ` AND role = 'disabled'`;
      }
    }
    
    // 添加分页（直接插值，因为已经转换为数字类型）
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
    
    // 查询总数
    const countResult = await db.query(countSql, countParams);
    const total = countResult[0].count;
    
    // 查询学生列表
    const students = await db.query(sql, params);
    
    // 处理返回数据格式，适配前端需要
    const formattedStudents = students.map(student => ({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      email: `${student.studentId}@example.com`, // 模拟邮箱
      phone: `138${Math.floor(Math.random() * 100000000)}`, // 模拟手机号
      classId: student.studentId.substring(0, 6), // 从学号中提取班级ID
      className: `${student.studentId.substring(0, 4)}级网络安全${student.studentId.substring(4, 6)}班`, // 模拟班级名称
      grade: student.studentId.substring(0, 4), // 从学号中提取年级
      status: student.role === 'disabled' ? 'disabled' : 'active',
      coursesCount: Math.floor(Math.random() * 10) + 1, // 模拟课程数
      experimentsCount: Math.floor(Math.random() * 20) + 1, // 模拟实验数
      createdTime: student.created_at
    }));
    
    res.status(200).json({
      success: true,
      data: formattedStudents,
      total: total
    });
  } catch (error) {
    console.error('获取学生列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取学生列表失败，请稍后重试'
    });
  }
});

// 添加学生API
app.post('/api/students', async (req, res) => {
  const { studentId, name, email, phone, classId, grade, status, password } = req.body;
  
  try {
    // 检查学号是否已存在
    const checkSql = 'SELECT * FROM user WHERE studentId = ?';
    const existingUser = await db.query(checkSql, [studentId]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: '学号已存在'
      });
    }
    
    // 创建新学生
    const insertSql = `
      INSERT INTO user (username, studentId, name, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(insertSql, [
      studentId, studentId, name, password, 'student'
    ]);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        studentId,
        name,
        email,
        phone,
        classId,
        grade,
        status,
        coursesCount: 0,
        experimentsCount: 0
      }
    });
  } catch (error) {
    console.error('添加学生失败:', error);
    res.status(500).json({
      success: false,
      message: '添加学生失败，请稍后重试'
    });
  }
});

// 更新学生信息API
app.put('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { name, email, phone, classId, grade, status } = req.body;
  
  try {
    // 检查学生是否存在
    const checkSql = 'SELECT * FROM user WHERE id = ? AND role = "student"';
    const existingUser = await db.query(checkSql, [studentId]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: '学生不存在'
      });
    }
    
    // 更新学生信息
    const updateSql = `
      UPDATE user SET 
        name = IFNULL(?, name)
      WHERE id = ?
    `;
    
    await db.query(updateSql, [name, studentId]);
    
    // 获取更新后的学生信息
    const selectSql = 'SELECT id, username, studentId, name, gender, created_at FROM user WHERE id = ?';
    const result = await db.query(selectSql, [studentId]);
    
    const student = result[0];
    
    res.status(200).json({
      success: true,
      data: {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        email,
        phone,
        classId,
        className: `${grade}级网络安全${classId.substring(4, 6)}班`,
        grade,
        status,
        coursesCount: Math.floor(Math.random() * 10) + 1,
        experimentsCount: Math.floor(Math.random() * 20) + 1,
        createdTime: student.created_at
      }
    });
  } catch (error) {
    console.error('更新学生信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新学生信息失败，请稍后重试'
    });
  }
});

// 删除学生API
app.delete('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  
  try {
    // 检查学生是否存在
    const checkSql = 'SELECT * FROM user WHERE id = ? AND role = "student"';
    const existingUser = await db.query(checkSql, [studentId]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: '学生不存在'
      });
    }
    
    // 删除学生
    const deleteSql = 'DELETE FROM user WHERE id = ? AND role = "student"';
    await db.query(deleteSql, [studentId]);
    
    res.status(200).json({
      success: true,
      message: '学生删除成功'
    });
  } catch (error) {
    console.error('删除学生失败:', error);
    res.status(500).json({
      success: false,
      message: '删除学生失败，请稍后重试'
    });
  }
});

// 更新学生状态API
app.patch('/api/students/:id/status', async (req, res) => {
  const studentId = req.params.id;
  const { status } = req.body;
  
  try {
    // 检查学生是否存在
    const checkSql = 'SELECT * FROM user WHERE id = ? AND role = "student"';
    const existingUser = await db.query(checkSql, [studentId]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: '学生不存在'
      });
    }
    
    // 更新学生状态（这里简化处理，将role字段设置为disabled表示禁用）
    const updateSql = `
      UPDATE user SET 
        role = ?
      WHERE id = ?
    `;
    
    await db.query(updateSql, [status === 'disabled' ? 'disabled' : 'student', studentId]);
    
    res.status(200).json({
      success: true,
      message: '学生状态更新成功'
    });
  } catch (error) {
    console.error('更新学生状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新学生状态失败，请稍后重试'
    });
  }
});

// 获取班级列表API
app.get('/api/classes', async (req, res) => {
  try {
    // 从学生表中提取班级信息（这里使用studentId的前6位作为班级ID）
    const sql = `
      SELECT DISTINCT LEFT(studentId, 6) AS classId, 
             CONCAT(SUBSTRING(studentId, 1, 4), '级网络安全', SUBSTRING(studentId, 5, 2), '班') AS className
      FROM user 
      WHERE role = 'student'
      ORDER BY classId
    `;
    
    const classes = await db.query(sql);
    
    res.status(200).json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('获取班级列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取班级列表失败，请稍后重试'
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
});
