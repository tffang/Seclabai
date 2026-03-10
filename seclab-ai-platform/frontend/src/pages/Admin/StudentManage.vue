<template>
  <Layout>
    <div class="student-manage-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">学生管理</h1>
        <p class="page-subtitle">管理平台上的所有学生用户</p>
      </div>

      <!-- 操作区域 -->
      <div class="operation-area">
        <div class="search-filter">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索学号、姓名或邮箱"
            prefix-icon="el-icon-search"
            size="default"
            style="width: 350px; margin-right: 15px;"
            @keyup.enter="handleSearch"
          ></el-input>
          <el-select
            v-model="filterClass"
            placeholder="筛选班级"
            size="default"
            style="width: 150px; margin-right: 15px;"
            @change="handleFilter"
          >
            <el-option label="全部" value=""></el-option>
            <el-option v-for="classItem in classes" :key="classItem.id" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
          <el-select
            v-model="filterStatus"
            placeholder="筛选状态"
            size="default"
            style="width: 150px; margin-right: 15px;"
            @change="handleFilter"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="active"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
            <el-option label="未激活" value="inactive"></el-option>
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="resetSearch">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </div>
        <div class="action-buttons">
          <el-button type="success" @click="handleAddStudent">
            <i class="el-icon-plus"></i> 添加学生
          </el-button>
          <el-button type="warning" @click="handleImportStudents">
            <i class="el-icon-upload2"></i> 导入学生
          </el-button>
          <el-button type="info" @click="handleExportStudents">
            <i class="el-icon-download"></i> 导出学生
          </el-button>
        </div>
      </div>

      <!-- 学生列表 -->
      <div class="student-list">
        <el-table
          :data="students"
          stripe
          border
          style="width: 100%"
          :default-sort="{ prop: 'registerTime', order: 'descending' }"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="id" label="学生ID" width="80" align="center"></el-table-column>
          <el-table-column prop="studentId" label="学号" width="120" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100" align="center"></el-table-column>
          <el-table-column prop="gender" label="性别" width="80" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.gender === '男' ? 'info' : 'success'">
                {{ scope.row.gender }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="className" label="所属班级" width="150" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
          <el-table-column prop="phone" label="手机号码" width="130" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusColor(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="registerTime" label="注册时间" width="160" align="center"></el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录" width="160" align="center"></el-table-column>
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleViewStudent(scope.row)">
                <i class="el-icon-view"></i> 查看
              </el-button>
              <el-button type="warning" size="small" @click="handleEditStudent(scope.row)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button 
                :type="scope.row.status === 'active' ? 'danger' : 'success'" 
                size="small" 
                @click="handleToggleStatus(scope.row)"
              >
                <i :class="scope.row.status === 'active' ? 'el-icon-lock' : 'el-icon-unlock'">
                </i> {{ scope.row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteStudent(scope.row)">
                <i class="el-icon-delete"></i> 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalStudents"
        ></el-pagination>
      </div>

      <!-- 添加/编辑学生对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="60%"
        :close-on-click-modal="false"
      >
        <el-form :model="studentForm" :rules="studentRules" ref="studentFormRef" label-width="120px">
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="studentForm.studentId" placeholder="请输入学号" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="studentForm.name" placeholder="请输入姓名" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="studentForm.gender">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属班级" prop="classId">
            <el-select v-model="studentForm.classId" placeholder="请选择所属班级">
              <el-option
                v-for="classItem in classes"
                :key="classItem.id"
                :label="classItem.name"
                :value="classItem.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="studentForm.email" placeholder="请输入邮箱" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="studentForm.phone" placeholder="请输入手机号码" maxlength="11" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-radio-group v-model="studentForm.status">
              <el-radio label="active">正常</el-radio>
              <el-radio label="disabled">禁用</el-radio>
              <el-radio label="inactive">未激活</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="!studentForm.id">
            <el-input
              v-model="studentForm.password"
              type="password"
              placeholder="请输入初始密码"
              maxlength="20"
              show-word-limit
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from './Layout.vue'

// 页面数据
const searchKeyword = ref('')
const filterClass = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalStudents = ref(0)

// 学生列表数据
const students = ref([])

// 班级列表（用于筛选和关联）
const classes = ref([
  { id: 1, name: '网络安全1班' },
  { id: 2, name: '网络安全2班' },
  { id: 3, name: '网络安全3班' },
  { id: 4, name: '信息安全班' },
  { id: 5, name: '网络安全2022级' }
])

// 对话框数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加学生')
const studentForm = ref({
  id: '',
  studentId: '',
  name: '',
  gender: '男',
  classId: '',
  className: '',
  email: '',
  phone: '',
  status: 'active',
  password: ''
})

// 表单验证规则
const studentRules = reactive({
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 5, max: 20, message: '学号长度在 5 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  classId: [
    { required: true, message: '请选择所属班级', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

// 表单引用
const studentFormRef = ref()

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    'active': 'success',
    'disabled': 'warning',
    'inactive': 'info'
  }
  return colorMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'active': '正常',
    'disabled': '禁用',
    'inactive': '未激活'
  }
  return textMap[status] || status
}

// 获取班级名称
const getClassName = (classId) => {
  const classItem = classes.value.find(item => item.id === classId)
  return classItem ? classItem.name : '无'
}

// 加载学生列表
const loadStudents = () => {
  // TODO: 真实API接口 - 获取学生列表
  // axios.get('/api/admin/students', {
  //   params: {
  //     page: currentPage.value,
  //     pageSize: pageSize.value,
  //     keyword: searchKeyword.value,
  //     classId: filterClass.value,
  //     status: filterStatus.value
  //   }
  // })
  // .then(response => {
  //   students.value = response.data.data
  //   totalStudents.value = response.data.total
  // })
  // .catch(error => {
  //   ElMessage.error('加载学生列表失败：' + error.message)
  // })

  // Mock数据
  setTimeout(() => {
    const mockStudents = [
      {
        id: 1,
        studentId: '2024010101',
        name: '张三',
        gender: '男',
        classId: 1,
        className: '网络安全1班',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        status: 'active',
        registerTime: '2024-09-01 10:30:00',
        lastLoginTime: '2024-11-15 14:20:00'
      },
      {
        id: 2,
        studentId: '2024010102',
        name: '李四',
        gender: '女',
        classId: 1,
        className: '网络安全1班',
        email: 'lisi@example.com',
        phone: '13800138002',
        status: 'active',
        registerTime: '2024-09-01 10:35:00',
        lastLoginTime: '2024-11-14 09:15:00'
      },
      {
        id: 3,
        studentId: '2024010201',
        name: '王五',
        gender: '男',
        classId: 2,
        className: '网络安全2班',
        email: 'wangwu@example.com',
        phone: '13800138003',
        status: 'active',
        registerTime: '2024-09-01 10:40:00',
        lastLoginTime: '2024-11-13 16:45:00'
      },
      {
        id: 4,
        studentId: '2024010202',
        name: '赵六',
        gender: '女',
        classId: 2,
        className: '网络安全2班',
        email: 'zhaoliu@example.com',
        phone: '13800138004',
        status: 'disabled',
        registerTime: '2024-09-01 10:45:00',
        lastLoginTime: '2024-10-20 11:20:00'
      },
      {
        id: 5,
        studentId: '2024010301',
        name: '孙七',
        gender: '男',
        classId: 3,
        className: '网络安全3班',
        email: 'sunqi@example.com',
        phone: '13800138005',
        status: 'inactive',
        registerTime: '2024-09-01 10:50:00',
        lastLoginTime: null
      },
      {
        id: 6,
        studentId: '2024010401',
        name: '周八',
        gender: '女',
        classId: 4,
        className: '信息安全班',
        email: 'zhouba@example.com',
        phone: '13800138006',
        status: 'active',
        registerTime: '2024-09-01 10:55:00',
        lastLoginTime: '2024-11-15 09:30:00'
      },
      {
        id: 7,
        studentId: '2023010101',
        name: '吴九',
        gender: '男',
        classId: 1,
        className: '网络安全1班',
        email: 'wujiu@example.com',
        phone: '13800138007',
        status: 'active',
        registerTime: '2023-09-01 09:30:00',
        lastLoginTime: '2024-11-14 15:25:00'
      },
      {
        id: 8,
        studentId: '2023010201',
        name: '郑十',
        gender: '女',
        classId: 2,
        className: '网络安全2班',
        email: 'zhengshi@example.com',
        phone: '13800138008',
        status: 'active',
        registerTime: '2023-09-01 09:35:00',
        lastLoginTime: '2024-11-13 14:10:00'
      }
    ]

    // 模拟筛选和搜索
    let filtered = [...mockStudents]
    if (searchKeyword.value) {
      filtered = filtered.filter(student => 
        student.studentId.includes(searchKeyword.value) || 
        student.name.includes(searchKeyword.value) || 
        student.email.includes(searchKeyword.value)
      )
    }
    if (filterClass.value) {
      filtered = filtered.filter(student => student.classId === filterClass.value)
    }
    if (filterStatus.value) {
      filtered = filtered.filter(student => student.status === filterStatus.value)
    }

    totalStudents.value = filtered.length
    students.value = filtered.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  }, 500)
}

// 搜索和筛选
const handleSearch = () => {
  currentPage.value = 1
  loadStudents()
}

const handleFilter = () => {
  currentPage.value = 1
  loadStudents()
}

const resetSearch = () => {
  searchKeyword.value = ''
  filterClass.value = ''
  filterStatus.value = ''
  currentPage.value = 1
  loadStudents()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadStudents()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadStudents()
}

// 添加学生
const handleAddStudent = () => {
  dialogTitle.value = '添加学生'
  studentForm.value = {
    id: '',
    studentId: '',
    name: '',
    gender: '男',
    classId: '',
    className: '',
    email: '',
    phone: '',
    status: 'active',
    password: ''
  }
  dialogVisible.value = true
}

// 编辑学生
const handleEditStudent = (row) => {
  dialogTitle.value = '编辑学生'
  studentForm.value = { ...row }
  dialogVisible.value = true
}

// 查看学生
const handleViewStudent = (row) => {
  // TODO: 跳转到学生详情页面
  ElMessage.info('查看学生：' + row.name)
}

// 切换学生状态
const handleToggleStatus = (row) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  const statusText = newStatus === 'active' ? '启用' : '禁用'
  
  ElMessageBox.confirm(`确定要${statusText}学生「${row.name}」吗？`, '状态确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    // TODO: 真实API接口 - 更新学生状态
    // axios.patch(`/api/admin/students/${row.id}/status`, {
    //   status: newStatus
    // })
    // .then(() => {
    //   ElMessage.success(`学生${statusText}成功`)
    //   loadStudents()
    // })
    // .catch(error => {
    //   ElMessage.error(`学生${statusText}失败：` + error.message)
    // })

    // Mock更新
    setTimeout(() => {
      ElMessage.success(`学生${statusText}成功`)
      loadStudents()
    }, 300)
  })
  .catch(() => {
    // 取消操作
  })
}

// 删除学生
const handleDeleteStudent = (row) => {
  ElMessageBox.confirm(`确定要删除学生「${row.name}」吗？删除后不可恢复。`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    // TODO: 真实API接口 - 删除学生
    // axios.delete('/api/admin/students/' + row.id)
    // .then(() => {
    //   ElMessage.success('学生删除成功')
    //   loadStudents()
    // })
    // .catch(error => {
    //   ElMessage.error('删除学生失败：' + error.message)
    // })

    // Mock删除
    setTimeout(() => {
      ElMessage.success('学生删除成功')
      loadStudents()
    }, 300)
  })
  .catch(() => {
    // 取消删除
  })
}

// 导入学生
const handleImportStudents = () => {
  // TODO: 实现学生导入功能
  ElMessage.info('学生导入功能开发中...')
}

// 导出学生
const handleExportStudents = () => {
  // TODO: 实现学生导出功能
  ElMessage.info('学生导出功能开发中...')
}

// 提交表单
const handleSubmit = () => {
  if (!studentFormRef.value) return
  
  studentFormRef.value.validate((valid) => {
    if (valid) {
      // 更新班级名称
      studentForm.value.className = getClassName(studentForm.value.classId)
      
      // TODO: 真实API接口 - 添加/编辑学生
      // const method = studentForm.value.id ? 'put' : 'post'
      // const url = studentForm.value.id ? `/api/admin/students/${studentForm.value.id}` : '/api/admin/students'
      // axios[method](url, studentForm.value)
      // .then(() => {
      //   ElMessage.success(dialogTitle.value + '成功')
      //   dialogVisible.value = false
      //   loadStudents()
      // })
      // .catch(error => {
      //   ElMessage.error(dialogTitle.value + '失败：' + error.message)
      // })

      // Mock提交
      setTimeout(() => {
        ElMessage.success(dialogTitle.value + '成功')
        dialogVisible.value = false
        loadStudents()
      }, 500)
    } else {
      return false
    }
  })
}

// 页面加载时初始化
onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
.student-manage-container {
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

.operation-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.student-list {
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .student-manage-container {
    padding: 1rem;
  }

  .operation-area {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filter {
    justify-content: stretch;
  }

  .search-filter .el-input {
    width: 100% !important;
    margin-right: 0 !important;
  }

  .search-filter .el-select {
    width: 100% !important;
    margin-right: 0 !important;
  }
}
</style>