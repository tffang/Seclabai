<template>
  <Layout>
    <div class="admin-profile-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">管理员中心</h1>
        <p class="page-subtitle">管理您的个人信息和账户设置</p>
      </div>

      <!-- 个人信息和设置区域 -->
      <div class="profile-content">
        <!-- 左侧：个人信息 -->
        <div class="profile-info">
          <div class="info-card">
            <div class="card-header">
              <h3 class="card-title">个人信息</h3>
            </div>
            <div class="card-content">
              <div class="avatar-section">
                <div class="avatar-container">
                  <img :src="adminInfo.avatar" alt="管理员头像" class="avatar">
                  <div class="avatar-upload">
                    <el-button type="primary" size="small" @click="handleAvatarUpload">
                      <i class="el-icon-upload"></i> 更换头像
                    </el-button>
                  </div>
                </div>
              </div>
              
              <div class="info-item">
                <label class="info-label">管理员ID</label>
                <div class="info-value">{{ adminInfo.id }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">用户名</label>
                <div class="info-value">{{ adminInfo.username }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">姓名</label>
                <div class="info-value">{{ adminInfo.name }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">邮箱</label>
                <div class="info-value">{{ adminInfo.email }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">手机号码</label>
                <div class="info-value">{{ adminInfo.phone }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">角色</label>
                <div class="info-value">
                  <el-tag type="danger">{{ adminInfo.role }}</el-tag>
                </div>
              </div>
              <div class="info-item">
                <label class="info-label">最后登录时间</label>
                <div class="info-value">{{ adminInfo.lastLoginTime }}</div>
              </div>
              <div class="info-item">
                <label class="info-label">账户创建时间</label>
                <div class="info-value">{{ adminInfo.createTime }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：账户设置 -->
        <div class="profile-settings">
          <!-- 修改密码 -->
          <div class="setting-card">
            <div class="card-header">
              <h3 class="card-title">修改密码</h3>
            </div>
            <div class="card-content">
              <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
                <el-form-item label="当前密码" prop="currentPassword">
                  <el-input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                    maxlength="20"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                    maxlength="20"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleChangePassword">
                    <i class="el-icon-lock"></i> 修改密码
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 账户设置 -->
          <div class="setting-card">
            <div class="card-header">
              <h3 class="card-title">账户设置</h3>
            </div>
            <div class="card-content">
              <el-form :model="accountSettings" ref="accountSettingsRef" label-width="120px">
                <el-form-item label="接收系统通知">
                  <el-switch v-model="accountSettings.receiveNotifications"></el-switch>
                </el-form-item>
                <el-form-item label="接收邮件通知">
                  <el-switch v-model="accountSettings.receiveEmails"></el-switch>
                </el-form-item>
                <el-form-item label="接收短信通知">
                  <el-switch v-model="accountSettings.receiveSms"></el-switch>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSaveSettings">
                    <i class="el-icon-check"></i> 保存设置
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from './Layout.vue'

// 管理员信息
const adminInfo = reactive({
  id: '',
  username: '',
  name: '',
  email: '',
  phone: '',
  role: '',
  avatar: '',
  lastLoginTime: '',
  createTime: ''
})

// 密码修改表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const passwordRules = reactive({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '新密码长度在 6 到 20 个字符', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

// 表单引用
const passwordFormRef = ref()
const accountSettingsRef = ref()

// 账户设置
const accountSettings = reactive({
  receiveNotifications: true,
  receiveEmails: true,
  receiveSms: false
})

// 验证新密码
const validateNewPassword = (rule, value, callback) => {
  if (value === passwordForm.currentPassword) {
    callback(new Error('新密码不能与当前密码相同'))
  } else {
    callback()
  }
}

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 加载管理员信息
const loadAdminInfo = () => {
  // TODO: 真实API接口 - 获取管理员信息
  // axios.get('/api/admin/profile')
  // .then(response => {
  //   Object.assign(adminInfo, response.data)
  // })
  // .catch(error => {
  //   ElMessage.error('加载管理员信息失败：' + error.message)
  // })

  // Mock数据
  setTimeout(() => {
    adminInfo.id = 1
    adminInfo.username = 'admin'
    adminInfo.name = '系统管理员'
    adminInfo.email = 'admin@example.com'
    adminInfo.phone = '13800138000'
    adminInfo.role = 'admin'
    adminInfo.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    adminInfo.lastLoginTime = '2024-11-15 14:20:00'
    adminInfo.createTime = '2024-01-01 00:00:00'
  }, 500)
}

// 加载账户设置
const loadAccountSettings = () => {
  // TODO: 真实API接口 - 获取账户设置
  // axios.get('/api/admin/settings')
  // .then(response => {
  //   Object.assign(accountSettings, response.data)
  // })
  // .catch(error => {
  //   ElMessage.error('加载账户设置失败：' + error.message)
  // })

  // Mock数据已在初始化时设置
}

// 更换头像
const handleAvatarUpload = () => {
  // TODO: 实现头像上传功能
  ElMessage.info('头像上传功能开发中...')
}

// 修改密码
const handleChangePassword = () => {
  if (!passwordFormRef.value) return
  
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 真实API接口 - 修改密码
      // axios.put('/api/admin/profile/password', passwordForm)
      // .then(() => {
      //   ElMessage.success('密码修改成功')
      //   // 清空表单
      //   passwordForm.currentPassword = ''
      //   passwordForm.newPassword = ''
      //   passwordForm.confirmPassword = ''
      // })
      // .catch(error => {
      //   ElMessage.error('密码修改失败：' + error.message)
      // })

      // Mock修改密码
      setTimeout(() => {
        ElMessage.success('密码修改成功')
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      }, 500)
    } else {
      return false
    }
  })
}

// 保存账户设置
const handleSaveSettings = () => {
  // TODO: 真实API接口 - 保存账户设置
  // axios.put('/api/admin/settings', accountSettings)
  // .then(() => {
  //   ElMessage.success('账户设置保存成功')
  // })
  // .catch(error => {
  //   ElMessage.error('保存账户设置失败：' + error.message)
  // })

  // Mock保存设置
  setTimeout(() => {
    ElMessage.success('账户设置保存成功')
  }, 300)
}

// 页面加载时初始化
onMounted(() => {
  loadAdminInfo()
  loadAccountSettings()
})
</script>

<style scoped>
.admin-profile-container {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
}

/* 个人信息和设置区域 */
.profile-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

/* 个人信息 */
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card, .setting-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

/* 头像部分 */
.avatar-section {
  margin-bottom: 1.5rem;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
}

.avatar-upload {
  display: flex;
  justify-content: center;
}

/* 信息项 */
.info-item {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.info-label {
  width: 80px;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.info-value {
  flex: 1;
  font-size: 0.95rem;
}

/* 账户设置 */
.profile-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 表单样式 */
.el-form {
  max-width: 600px;
}

.el-form-item {
  margin-bottom: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-profile-container {
    padding: 1rem;
  }

  .profile-content {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .info-label {
    width: auto;
  }
}

@media (max-width: 480px) {
  .card-content {
    padding: 0;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }
}
</style>