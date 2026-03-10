<template>
  <Layout>
    <div class="profile-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">个人中心</h1>
        <p class="page-subtitle">管理您的个人信息</p>
      </div>

      <!-- 主要内容 -->
      <div class="profile-content">
        <!-- 个人信息卡片 -->
        <el-card class="profile-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h2>个人信息</h2>
              <el-button type="primary" size="small" @click="editMode = true">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
            </div>
          </template>
          <div class="profile-info">
            <div class="info-item">
              <label class="info-label">姓名</label>
              <span class="info-value">{{ teacherInfo.name }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">工号</label>
              <span class="info-value">{{ teacherInfo.teacherId }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">邮箱</label>
              <span class="info-value">{{ teacherInfo.email }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">手机号</label>
              <span class="info-value">{{ teacherInfo.phone }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">所属部门</label>
              <span class="info-value">{{ teacherInfo.department }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">职称</label>
              <span class="info-value">{{ teacherInfo.title }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">入职时间</label>
              <span class="info-value">{{ teacherInfo.hireDate }}</span>
            </div>
          </div>
        </el-card>

        <!-- 编辑个人信息表单 -->
        <el-card v-if="editMode" class="edit-profile-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h2>编辑个人信息</h2>
            </div>
          </template>
          <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="editForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="department">
              <el-input v-model="editForm.department" placeholder="请输入所属部门"></el-input>
            </el-form-item>
            <el-form-item label="职称" prop="title">
              <el-input v-model="editForm.title" placeholder="请输入职称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveEdit">保存</el-button>
              <el-button @click="handleCancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 统计数据卡片 -->
        <div class="stats-cards">
          <el-card class="stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stats-icon courses-icon">
                <i class="el-icon-collection"></i>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.coursesCount }}</div>
                <div class="stats-label">我的课程</div>
              </div>
            </div>
          </el-card>
          <el-card class="stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stats-icon experiments-icon">
                <i class="el-icon-s-promotion"></i>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.experimentsCount }}</div>
                <div class="stats-label">我的实验</div>
              </div>
            </div>
          </el-card>
          <el-card class="stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stats-icon students-icon">
                <i class="el-icon-user"></i>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.studentsCount }}</div>
                <div class="stats-label">我的学生</div>
              </div>
            </div>
          </el-card>
          <el-card class="stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stats-icon teachingHours-icon">
                <i class="el-icon-time"></i>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.teachingHours }}</div>
                <div class="stats-label">教学时长</div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 修改密码卡片 -->
        <el-card class="password-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h2>修改密码</h2>
            </div>
          </template>
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input type="password" v-model="passwordForm.oldPassword" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input type="password" v-model="passwordForm.confirmPassword" placeholder="请确认新密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
              <el-button @click="passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' }">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Layout from './Layout.vue'

// 个人信息
const teacherInfo = ref({
  name: '张教授',
  teacherId: 'T2021001',
  email: 'zhangjiaoshou@example.com',
  phone: '13800138000',
  department: '网络空间安全学院',
  title: '教授',
  hireDate: '2015-09-01'
})

// 编辑模式
const editMode = ref(false)

// 编辑表单
const editForm = ref({})
const editFormRef = ref()

// 编辑表单验证规则
const editRules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入所属部门', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入职称', trigger: 'blur' }
  ]
})

// 统计数据
const stats = ref({
  coursesCount: 5,
  experimentsCount: 12,
  studentsCount: 200,
  teachingHours: '1200小时'
})

// 密码修改表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordFormRef = ref()

// 密码修改验证规则
const passwordRules = reactive({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 初始化编辑表单
const initEditForm = () => {
  editForm.value = {
    name: teacherInfo.value.name,
    email: teacherInfo.value.email,
    phone: teacherInfo.value.phone,
    department: teacherInfo.value.department,
    title: teacherInfo.value.title
  }
}

// 保存编辑
const handleSaveEdit = () => {
  if (!editFormRef.value) return
  
  editFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 真实API接口 - 更新教师信息
      // import { updateTeacherInfo } from '@/api/teacher'
      // try {
      //   await updateTeacherInfo(editForm.value)
      //   ElMessage.success('个人信息更新成功')
      //   // 更新显示的信息
      //   Object.assign(teacherInfo.value, editForm.value)
      //   editMode.value = false
      // } catch (error) {
      //   ElMessage.error('更新个人信息失败：' + error.message)
      // }

      // Mock保存
      setTimeout(() => {
        ElMessage.success('个人信息更新成功')
        // 更新显示的信息
        Object.assign(teacherInfo.value, editForm.value)
        editMode.value = false
      }, 500)
    } else {
      return false
    }
  })
}

// 取消编辑
const handleCancelEdit = () => {
  editMode.value = false
  initEditForm()
}

// 修改密码
const handleChangePassword = () => {
  if (!passwordFormRef.value) return
  
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 真实API接口 - 修改密码
      // import { changePassword } from '@/api/auth'
      // try {
      //   await changePassword({
      //     oldPassword: passwordForm.value.oldPassword,
      //     newPassword: passwordForm.value.newPassword
      //   })
      //   ElMessage.success('密码修改成功')
      //   // 重置表单
      //   passwordForm.value = {
      //     oldPassword: '',
      //     newPassword: '',
      //     confirmPassword: ''
      //   }
      // } catch (error) {
      //   ElMessage.error('修改密码失败：' + error.message)
      // }

      // Mock修改密码
      setTimeout(() => {
        ElMessage.success('密码修改成功')
        // 重置表单
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }, 500)
    } else {
      return false
    }
  })
}

// 页面加载时初始化
onMounted(() => {
  initEditForm()
})
</script>

<style scoped>
.profile-container {
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

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card,
.edit-profile-card,
.password-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.profile-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stats-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
}

.courses-icon {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover-color));
}

.experiments-icon {
  background: linear-gradient(135deg, var(--success-color), var(--success-hover-color));
}

.students-icon {
  background: linear-gradient(135deg, var(--warning-color), var(--warning-hover-color));
}

.teachingHours-icon {
  background: linear-gradient(135deg, var(--info-color), var(--info-hover-color));
}

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stats-number {
  font-size: 1.5rem;
  font-weight: 700;
}

.stats-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-info {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .stats-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>