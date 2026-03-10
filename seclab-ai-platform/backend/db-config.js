// MySQL数据库配置
module.exports = {
  host: 'localhost', // 数据库地址
  user: 'root', // 数据库用户名
  password: '1128', // 数据库密码
  database: 'seclab_ai', // 数据库名（根据init.sql文件修改）
  port: 3306, // 数据库端口
  charset: 'utf8mb4', // 字符集
  connectionLimit: 10, // 连接池最大连接数
  queueLimit: 0 // 连接池排队限制，0表示不限制
};
