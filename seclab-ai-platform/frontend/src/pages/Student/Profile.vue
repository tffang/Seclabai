<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Layout from './Layout.vue'
import { useUserStore } from '../../store/user'

const router = useRouter()

// 创建userStore实例
const userStore = useUserStore()

// 创建本地表单数据对象
const profileForm = reactive({
  name: '',
  studentId: '',
  gender: '',
  role: ''
})

// 页面加载时获取用户信息
onMounted(async () => {
  await loadUserInfo()
  await loadLearningStats()
})

// 保存按钮加载状态
const saveLoading = ref(false)

// 密码修改对话框
const passwordDialogVisible = ref(false)

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// 密码修改表单验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmNewPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur' }
  ]
}

// 密码修改表单引用
const passwordFormRef = ref(null)

// 表单验证
const profileRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 1, max: 15, message: '学号长度不超过 15 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}

// 表单引用
const profileFormRef = ref(null)



// 性别选项
const genderOptions = [
  { label: '女', value: '女' },
  { label: '男', value: '男' }
]

// 加载用户信息
const loadUserInfo = async () => {
  // 首先检查store中是否已有用户信息
  if (!userStore.userInfo) {
    // 如果store中没有用户信息，从API获取
    const success = await userStore.fetchCurrentUser()
    if (!success) {
      ElMessage.warning('用户信息加载失败，请重新登录')
      router.push('/login')
      return
    }
  }
  
  // 将用户信息同步到本地表单数据对象
  if (userStore.userInfo) {
    profileForm.name = userStore.userInfo.name || ''
    profileForm.studentId = userStore.userInfo.studentId || ''
    profileForm.gender = userStore.userInfo.gender || ''
    profileForm.role = userStore.userInfo.role || ''
  }
}

// 加载学习统计数据
const loadLearningStats = async () => {
  await userStore.getLearningStatistics()
}

// 保存修改
const handleSave = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    
    // 显示保存加载状态
    saveLoading.value = true
    
    // 将本地表单数据同步到store
    if (userStore.userInfo) {
      userStore.userInfo.name = profileForm.name
      userStore.userInfo.studentId = profileForm.studentId
      userStore.userInfo.gender = profileForm.gender
    }
    
    // 使用store的方法更新用户信息
    const success = await userStore.updateUserInfo(userStore.userInfo)
    
    if (success) {
      ElMessage.success('个人信息修改成功')
    } else {
      ElMessage.error('个人信息修改失败')
    }
    
    // 隐藏保存加载状态
    saveLoading.value = false
  } catch (error) {
    console.error('表单验证失败', error)
    ElMessage.error('请检查表单填写是否正确')
    saveLoading.value = false
  }
}

// 取消修改
const handleCancel = () => {
  // 重置表单
  if (profileFormRef.value) {
    profileFormRef.value.resetFields()
  }
  ElMessage.info('已取消修改')
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  // 跳转到登录页
  router.push('/login')
}

// 上传头像
const handleAvatarUpload = async (file) => {
  // 使用store的方法上传头像
  const success = await userStore.uploadAvatar(file.raw)
  
  if (success) {
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
  
  return false // 阻止自动上传
}

// 打开密码修改对话框
const openPasswordDialog = () => {
  passwordDialogVisible.value = true
}

// 关闭密码修改对话框
const closePasswordDialog = () => {
  passwordDialogVisible.value = false
  // 重置表单
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 保存密码修改
const savePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    
    // 使用store的方法修改密码
    const success = await userStore.changePassword(passwordForm)
    
    if (success) {
      ElMessage.success('密码修改成功')
      closePasswordDialog()
    } else {
      ElMessage.error('密码修改失败')
    }
  } catch (error) {
    console.error('密码修改验证失败', error)
    ElMessage.error('请检查密码填写是否正确')
  }
}
</script>

<template>
  <Layout>
    <div class="profile-container">
    
    <!-- 主体内容区域 -->
    <main class="profile-main">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">个人中心</h2>
        <p class="page-subtitle">管理你的个人信息和学习记录</p>
      </div>
      
      <!-- 用户信息卡片 -->
      <div class="user-info-card security-card">
        <!-- 用户头像和基本信息 -->
        <div class="user-basic-info">
          <div class="avatar-container">
            <el-upload
              action="#"
              :show-file-list="false"
              :before-upload="handleAvatarUpload"
              class="avatar-uploader"
            >
              <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo?.avatar" class="avatar" alt="用户头像" />
              <div v-else class="avatar-placeholder">
                <i class="el-icon-user"></i>
              </div>
              <div class="avatar-upload-mask">
                <i class="el-icon-plus"></i>
              </div>
            </el-upload>
          </div>
          
          <div class="user-details">
            <h3 class="user-name">{{ userStore.userInfo?.name || '未登录用户' }}</h3>
            <div class="user-meta">
              <span class="meta-item role">{{ userStore.userInfo?.role || '' }}</span>
              <span class="meta-item student-id">学号：{{ userStore.userInfo?.studentId || '' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 学习统计卡片 -->
      <div class="learning-stats-card security-card">
        <h3 class="card-title">学习统计</h3>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-label">完成课程</div>
              <div class="stat-value">{{ userStore.learningStats.completedCourses }}</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-label">总分</div>
              <div class="stat-value">{{ userStore.learningStats.totalScore }}</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-label">排名</div>
              <div class="stat-value">#{{ userStore.learningStats.ranking }}</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-label">连续学习</div>
              <div class="stat-value">{{ userStore.learningStats.consecutiveDays }}天</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 个人资料编辑表单 -->
      <div class="profile-form-card security-card">
        <h3 class="card-title">个人资料</h3>
        
        <el-form
          ref="profileFormRef"
          :model="profileForm"
          :rules="profileRules"
          label-position="left"
          label-width="100px"
          class="profile-form"
        >
          <div class="form-row">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="profileForm.name"
                placeholder="请输入姓名"
                size="large"
                class="input-field"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="学号" prop="studentId">
              <el-input
                v-model="profileForm.studentId"
                placeholder="请输入学号"
                size="large"
                class="input-field"
              ></el-input>
            </el-form-item>
          </div>
          

          
          <div class="form-row">
            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="profileForm.gender"
                placeholder="请选择性别"
                size="large"
                class="select-field"
              >
                <el-option
                  v-for="option in genderOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="角色">
              <el-input
                v-model="profileForm.role"
                disabled
                size="large"
                class="input-field"
              ></el-input>
            </el-form-item>
          </div>
          
          <div class="form-actions">
            <el-button type="primary" size="large" @click="handleSave" class="btn-primary" :loading="saveLoading">
              <i class="el-icon-check"></i> 保存
            </el-button>
            <el-button size="large" @click="handleCancel">
              <i class="el-icon-close"></i> 取消
            </el-button>
            <el-button type="success" size="large" @click="openPasswordDialog">
              <i class="el-icon-key"></i> 修改密码
            </el-button>
          </div>
        </el-form>
      </div>
    </main>
  </div>
  
  <!-- 密码修改对话框 -->
  <el-dialog
    v-model="passwordDialogVisible"
    title="修改密码"
    width="500px"
    center
  >
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-position="top"
      label-width="80px"
      class="password-form"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          placeholder="请输入原密码"
          size="large"
          show-password
          class="input-field"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码"
          size="large"
          show-password
          class="input-field"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="确认新密码" prop="confirmNewPassword">
        <el-input
          v-model="passwordForm.confirmNewPassword"
          type="password"
          placeholder="请确认新密码"
          size="large"
          show-password
          class="input-field"
        ></el-input>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closePasswordDialog">取消</el-button>
        <el-button type="primary" @click="savePassword">确定</el-button>
      </span>
    </template>
  </el-dialog>
  </Layout>
</template>

<style scoped>
.profile-container {
  min-height: 100%;
  background: var(--gradient-primary);
  color: var(--text-primary);
}

/* 主体内容区域 */
.profile-main {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-tertiary);
  margin: 0;
}

/* 卡片通用样式 */
.security-card {
  margin-bottom: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* 用户信息卡片 */
.user-info-card {
  padding: 2rem;
}

.user-basic-info {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--text-tertiary);
  border: 3px solid var(--primary-color);
}

.avatar-uploader {
  position: relative;
  cursor: pointer;
}

.avatar-upload-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
  
  i {
    font-size: 2rem;
    color: white;
  }
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.user-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.meta-item {
  font-size: 0.95rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.role {
    background: rgba(64, 158, 255, 0.1);
    color: var(--primary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-weight: 500;
  }
}

/* 学习统计卡片 */
.learning-stats-card {
  padding: 2rem;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: rgba(64, 158, 255, 0.3);
  }
}

.stat-icon {
  font-size: 2.5rem;
  min-width: 50px;
  text-align: center;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* 个人资料表单 */
.profile-form-card {
  padding: 2rem;
}

.profile-form {
  max-width: 1000px;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row > .el-form-item {
  flex: 1;
  margin-bottom: 0;
}

.input-field {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-color);
  color: var(--text-primary);
  border-radius: 8px;
  width: 100%;
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
  
  .el-input__inner {
    background: transparent;
    color: var(--text-primary);
    border: none;
  }
  
  .el-select__input {
    color: var(--text-primary);
  }
  
  .el-select-dropdown {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }
  
  .el-select-dropdown__item {
    color: var(--text-primary);
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
    }
    
    &.selected {
      background: rgba(64, 158, 255, 0.2);
      color: var(--primary-color);
    }
  }
  
  :deep(.el-input.is-disabled .el-input__inner) {
    color: var(--text-tertiary);
    background: rgba(255, 255, 255, 0.05);
  }
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

/* AI助手按钮 */
.ai-assistant-button {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  
  .el-button {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
    width: 60px;
    height: 60px;
    
    &:hover {
      background: linear-gradient(135deg, var(--primary-dark) 0%, #1d4ed8 100%);
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.5);
    }
    
    i {
      font-size: 1.5rem;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    padding: 0 1rem;
    flex-direction: column;
    height: auto;
    gap: 1rem;
  }
  
  .header-nav {
    margin: 0;
    width: 100%;
  }
  
  .nav-menu {
    height: auto;
    line-height: normal;
    overflow-x: auto;
  }
  
  .profile-main {
    padding: 1rem;
  }
  
  .user-basic-info {
    flex-direction: column;
    text-align: center;
  }
  
  .user-meta {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .ai-assistant-button {
    right: 1rem;
    bottom: 1rem;
  }
}
</style>