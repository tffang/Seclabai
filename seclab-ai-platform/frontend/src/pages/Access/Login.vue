<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

const router = useRouter()

// 表单数据
const loginForm = reactive({
  username: 'student',
  studentId: '2023001',
  password: 'a123456',
  role: 'student',
  rememberMe: false
})

// 登录按钮加载状态
const loginLoading = ref(false)

// 是否显示密码
const showPassword = ref(false)

// 表单验证
const loginRules = {
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 3, max: 20, message: '学号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 表单引用
const loginFormRef = ref(null)

// 创建userStore实例
const userStore = useUserStore()

// 角色切换处理函数
const handleRoleChange = () => {
  if (loginForm.role === 'student') {
    // 切换到学生角色，清空用户名
    loginForm.username = ''
    // 设置学生默认账号密码
    loginForm.studentId = '2023001'
    loginForm.password = 'a123456'
  } else {
    // 切换到教师/管理员角色，清空学号
    loginForm.studentId = ''
    // 根据角色设置默认账号密码
    if (loginForm.role === 'teacher') {
      loginForm.username = 'teacher'
      loginForm.password = 'teacher123'
    } else {
      loginForm.username = 'admin'
      loginForm.password = 'admin123'
    }
  }
}

// 登录方法
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    
    // 显示登录加载状态
    loginLoading.value = true
    
    // 构建登录凭证
    const credentials = {
      password: loginForm.password,
      role: loginForm.role
    }
    
    // 根据角色添加对应字段
    if (loginForm.role === 'student') {
      credentials.studentId = loginForm.studentId
    } else {
      credentials.username = loginForm.username
    }
    
    // 调用userStore的登录方法
    const loginSuccess = await userStore.login(credentials)
    
    if (loginSuccess) {
      ElMessage.success('登录成功')
      
      // 隐藏登录加载状态
      loginLoading.value = false
      
      // 根据角色跳转到对应首页
      if (loginForm.role === 'student') {
        router.push('/student/dashboard')
      } else if (loginForm.role === 'teacher') {
        router.push('/teacher/courses')
      } else {
        router.push('/admin/dashboard')
      }
    } else {
      ElMessage.error('登录失败，请检查学号和密码')
      loginLoading.value = false
    }
  } catch (error) {
    console.error('登录验证失败', error)
    ElMessage.error('登录失败，请检查表单填写是否正确')
    loginLoading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中')
}

// 跳转到注册页
const toRegister = () => {
  router.push('/register')
}

// 第三方登录
const handleThirdPartyLogin = (type) => {
  ElMessage.info(`${type}登录功能开发中`)
}
</script>

<template>
  <div class="login-container">
    <!-- 左侧介绍区域 -->
    <div class="login-left">
      <div class="logo-container">
        <h1 class="logo">Sec Lab</h1>
        <h2 class="subtitle text-gradient">网络安全实验平台</h2>
        <p class="description">从基础到进阶，系统化的安全实验课程</p>
      </div>
      
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">🎓</div>
          <div class="feature-content">
            <h3 class="feature-title">系统化学习</h3>
            <p class="feature-desc">科学设计的课程体系，循序渐进的学习路径</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">💻</div>
          <div class="feature-content">
            <h3 class="feature-title">实战演练</h3>
            <p class="feature-desc">真实实验环境，动手实践提升安全技能</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🛡️</div>
          <div class="feature-content">
            <h3 class="feature-title">安全保障</h3>
            <p class="feature-desc">标准化的实验环境，确保学习过程安全可控</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧登录表单区域 -->
    <div class="login-right">
      <div class="login-form-container">
        <div class="login-header">
          <div class="login-icon">🎯</div>
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-subtitle">登录以继续你的安全之旅</p>
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="left"
          label-width="70px"
          class="login-form"
        >
          <!-- 角色选择 -->
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="loginForm.role"
              placeholder="请选择角色"
              size="large"
              class="input-field"
              @change="handleRoleChange"
            >
              <el-option label="学生" value="student"></el-option>
              <el-option label="教师" value="teacher"></el-option>
              <el-option label="管理员" value="admin"></el-option>
            </el-select>
          </el-form-item>
          
          <!-- 学生登录：显示学号 -->
          <el-form-item v-if="loginForm.role === 'student'" label="学号" prop="studentId">
            <el-input
              v-model="loginForm.studentId"
              placeholder="请输入学号"
              size="large"
              prefix-icon="el-icon-user"
              class="input-field"
            ></el-input>
          </el-form-item>
          
          <!-- 教师/管理员登录：显示用户名 -->
          <el-form-item v-else label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              prefix-icon="el-icon-user"
              class="input-field"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              size="large"
              :type="showPassword ? 'text' : 'password'"
              prefix-icon="el-icon-lock"
              class="input-field"
            >
              <template #suffix>
                <i class="el-icon-view" @click="showPassword = !showPassword" style="cursor: pointer;"></i>
              </template>
            </el-input>
          </el-form-item>
          
          <div class="form-options">
            <el-checkbox v-model="loginForm.rememberMe" size="small">记住我</el-checkbox>
            <el-link type="primary" underline="never" @click="handleForgotPassword" size="small">忘记密码?</el-link>
          </div>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              @click="handleLogin"
              class="login-button"
              :loading="loginLoading"
            >
              <i class="el-icon-right"></i> 登录
            </el-button>
          </el-form-item>
          
          <div class="divider">
            <span>或使用以下方式登录</span>
          </div>
          
          <div class="third-party-login">
            <el-button
              type="default"
              size="large"
              circle
              @click="handleThirdPartyLogin('Google')"
              class="third-party-btn"
            >
              <i class="el-icon-google"></i>
            </el-button>
            <el-button
              type="default"
              size="large"
              circle
              @click="handleThirdPartyLogin('QQ')"
              class="third-party-btn"
            >
              <i class="el-icon-qq"></i>
            </el-button>
            <el-button
              type="default"
              size="large"
              circle
              @click="handleThirdPartyLogin('Wechat')"
              class="third-party-btn"
            >
              <i class="el-icon-wechat"></i>
            </el-button>
          </div>
          
          <div class="register-link">
            <span>没有账号?</span>
            <el-link type="primary" underline="never" @click="toRegister">立即注册</el-link>
          </div>
        </el-form>
        
        <div class="login-footer">
          <el-link type="info" underline="never" size="small">网站声明</el-link>
          <el-link type="info" underline="never" size="small">帮助中心</el-link>
          <el-link type="info" underline="never" size="small">联系我们</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: transparent;
}

/* 左侧介绍区域 */
.login-left {
  flex: 1;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  padding: 4rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 右侧登录表单区域 */
.login-right {
  width: 450px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container {
  margin-bottom: 4rem;
}

.logo {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.feature-icon {
  font-size: 2rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 50px;
  text-align: center;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.feature-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.login-form-container {
  width: 100%;
  max-width: 360px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.login-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.login-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.login-form {
  width: 100%;
}

.input-field {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
  
  & .el-input__inner {
    background: transparent;
    color: white;
    border: none;
  }
  
  & .el-input__prefix {
    color: rgba(255, 255, 255, 0.5);
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-options .el-checkbox__label {
  color: rgba(255, 255, 255, 0.8);
}

.login-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  
  & span {
    flex: 0 0 auto;
    padding: 0 1rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
}

.third-party-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.third-party-btn {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}

.register-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  
  & span {
    margin-right: 0.5rem;
  }
}

.login-footer {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-left {
    display: none;
  }
  
  .login-right {
    width: 100%;
    height: 100vh;
  }
}
</style>