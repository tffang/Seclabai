<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

const router = useRouter()

// 表单数据
const registerForm = reactive({
  name: '测试学生',
  studentId: '2023999',
  password: 'a123456',
  confirmPassword: 'a123456',
  gender: '男',
  role: 'student' // 默认学生角色，不允许用户选择
})

// 注册按钮加载状态
const registerLoading = ref(false)

// 密码强度
const passwordStrength = ref('')

// 密码强度规则
const passwordStrengthRules = [
  { pattern: /[a-z]/, message: '包含小写字母' },
  { pattern: /[A-Z]/, message: '包含大写字母' },
  { pattern: /\d/, message: '包含数字' },
  { pattern: /[^\w\s]/, message: '包含特殊字符' },
  { pattern: /.{8,}/, message: '至少8个字符' }
]

// 检查密码强度
const checkPasswordStrength = (password) => {
  let strength = 0
  const matchedRules = []
  
  passwordStrengthRules.forEach(rule => {
    if (rule.pattern.test(password)) {
      strength++
      matchedRules.push(rule.message)
    }
  })
  
  if (strength === 0) passwordStrength.value = ''
  else if (strength <= 2) passwordStrength.value = '弱'
  else if (strength <= 4) passwordStrength.value = '中'
  else passwordStrength.value = '强'
  
  return matchedRules
}

// 表单验证
const registerRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 3, max: 20, message: '学号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value) {
          const matchedRules = checkPasswordStrength(value)
          // 降低密码强度要求，只需要至少2个规则
          if (matchedRules.length < 2) {
            callback(new Error('密码强度不足，建议包含字母、数字和特殊字符'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}

// 表单引用
const registerFormRef = ref(null)



// 性别选项
const genderOptions = [
  { label: '女', value: '女' },
  { label: '男', value: '男' }
]

// 创建userStore实例
const userStore = useUserStore()

// 注册方法
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    console.log('开始注册流程')
    
    // 验证表单
    await registerFormRef.value.validate()
    console.log('表单验证通过')
    
    // 显示注册加载状态
    registerLoading.value = true
    
    console.log('发送注册请求:', registerForm)
    
    // 调用userStore的注册方法
    const registerSuccess = await userStore.register(registerForm)
    
    console.log('注册请求返回结果:', registerSuccess)
    
    if (registerSuccess) {
      ElMessage.success('注册成功，请登录')
      
      // 隐藏注册加载状态
      registerLoading.value = false
      
      // 跳转到登录页
      router.push('/login')
    } else {
      ElMessage.error('注册失败，请检查输入信息')
      registerLoading.value = false
    }
  } catch (error) {
    console.error('注册过程发生错误:', error)
    if (error.response) {
      console.error('错误响应数据:', error.response.data)
    }
    ElMessage.error('注册失败，请检查表单填写是否正确')
    registerLoading.value = false
  }
}

// 跳转到登录页
const toLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <!-- 左侧介绍区域 -->
    <div class="register-left">
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
    
    <!-- 右侧注册表单区域 -->
    <div class="register-right">
      <div class="register-form-container">
        <div class="register-header">
          <div class="register-icon">🎯</div>
          <h2 class="register-title">加入我们</h2>
          <p class="register-subtitle">创建账号开启你的安全学习之旅</p>
        </div>
        
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="left"
          label-width="70px"
          class="register-form"
        >
          <div class="form-row">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="registerForm.name"
                placeholder="请输入姓名"
                size="large"
                prefix-icon="el-icon-user"
                class="input-field"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="学号" prop="studentId">
              <el-input
                v-model="registerForm.studentId"
                placeholder="请输入学号(最多15位)"
                size="large"
                prefix-icon="el-icon-document"
                class="input-field"
              ></el-input>
            </el-form-item>
          </div>
          

          

          
          <div class="form-row">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="el-icon-lock"
                show-password
                class="input-field"
                @input="checkPasswordStrength(registerForm.password)"
              ></el-input>
              <!-- 密码强度指示器 -->
              <div v-if="passwordStrength" class="password-strength">
                <span class="strength-label">密码强度:</span>
                <span class="strength-value" :class="passwordStrength">{{ passwordStrength }}</span>
              </div>
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                size="large"
                prefix-icon="el-icon-lock"
                show-password
                class="input-field"
              ></el-input>
            </el-form-item>
          </div>
          
          <div class="form-row">
            <el-form-item label="性别" prop="gender">
              <div class="gender-radio-group">
                <el-radio v-model="registerForm.gender" label="女">女</el-radio>
                <el-radio v-model="registerForm.gender" label="男">男</el-radio>
              </div>
            </el-form-item>
          </div>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              @click="handleRegister"
              class="register-button"
              :loading="registerLoading"
            >
              <i class="el-icon-check"></i> 注册
            </el-button>
          </el-form-item>
          
          <div class="login-link">
            <span>已有账号?</span>
            <el-link type="primary" underline="never" @click="toLogin">立即登录</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 左侧介绍区域 */
.register-left {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 4rem;
  color: white;
  display: flex;
  flex-direction: column;
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

/* 右侧注册表单区域 */
.register-right {
  width: 450px;
  background: #1e293b;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.register-form-container {
  width: 100%;
  max-width: 360px;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.register-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.register-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.register-form {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-direction: column;
}

.form-row > .el-form-item {
  width: 100%;
  margin-bottom: 0;
}

.input-field {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  width: 100%;
  
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
  
  & .el-select__input {
    color: white;
  }
  
  & .el-select-dropdown {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }
  
  & .el-select-dropdown__item {
    color: white;
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
    }
    
    &.selected {
      background: rgba(64, 158, 255, 0.2);
      color: var(--primary-color);
    }
  }
}

.register-button {
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

.login-link {
  text-align: center;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  
  & span {
    margin-right: 0.5rem;
  }
}

/* 密码强度样式 */
.password-strength {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.strength-label {
  margin-right: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.strength-value {
  font-weight: 500;
}

.strength-value.弱 {
  color: #ff4d4f;
}

.strength-value.中 {
  color: #faad14;
}

.strength-value.强 {
  color: #52c41a;
}

/* 性别单选按钮组样式 */
.gender-radio-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.gender-radio-group .el-radio {
  margin-right: 0;
}

.gender-radio-group .el-radio__label {
  color: rgba(255, 255, 255, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }
  
  .register-left {
    display: none;
  }
  
  .register-right {
    width: 100%;
    height: 100vh;
  }
  
  .form-row {
    flex-direction: column;
  }
}
</style>