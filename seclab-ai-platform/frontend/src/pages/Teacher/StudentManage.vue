<template>
  <Layout>
    <div class="student-manage-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">学生管理</h1>
        <p class="page-subtitle">管理您的学生账户</p>
      </div>

      <!-- 操作区域 -->
      <div class="operation-area">
        <div class="search-filter">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索学生姓名或学号"
            prefix-icon="el-icon-search"
            size="default"
            style="width: 300px; margin-right: 15px;"
            @keyup.enter="handleSearch"
          ></el-input>
          <el-select
            v-model="filterClass"
            placeholder="选择班级"
            size="default"
            style="width: 180px; margin-right: 15px;"
            @change="handleFilter"
          >
            <el-option label="全部班级" value=""></el-option>
            <el-option label="2021级网络安全1班" value="202101"></el-option>
            <el-option label="2021级网络安全2班" value="202102"></el-option>
            <el-option label="2022级网络安全1班" value="202201"></el-option>
            <el-option label="2022级网络安全2班" value="202202"></el-option>
          </el-select>
          <el-select
            v-model="filterStatus"
            placeholder="筛选状态"
            size="default"
            style="width: 150px; margin-right: 15px;"
            @change="handleFilter"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="激活" value="active"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
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
        </div>
      </div>

      <!-- 学生列表 -->
      <div class="student-list">
        <el-table
          :data="students"
          stripe
          border
          style="width: 100%"
          :default-sort="{ prop: 'studentId', order: 'ascending' }"
        >
          <el-table-column prop="studentId" label="学号" width="120" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
          <el-table-column prop="className" label="班级" width="150" align="center"></el-table-column>
          <el-table-column prop="grade" label="年级" width="80" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="active"
                inactive-value="disabled"
                @change="handleStatusChange(scope.row)"
                :active-text="'激活'"
                :inactive-text="'禁用'"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="coursesCount" label="课程数" width="80" align="center"></el-table-column>
          <el-table-column prop="experimentsCount" label="实验数" width="80" align="center"></el-table-column>
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleViewStudent(scope.row)">
                <i class="el-icon-view"></i> 查看
              </el-button>
              <el-button type="warning" size="small" @click="handleEditStudent(scope.row)">
                <i class="el-icon-edit"></i> 编辑
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
            <el-input v-model="studentForm.studentId" placeholder="请输入学号" maxlength="20" show-word-limit :disabled="!!studentForm.id"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="studentForm.name" placeholder="请输入姓名" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="studentForm.email" placeholder="请输入邮箱" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="studentForm.phone" placeholder="请输入手机号" maxlength="11" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="班级" prop="classId">
            <el-select v-model="studentForm.classId" placeholder="请选择班级">
              <el-option label="2021级网络安全1班" value="202101"></el-option>
              <el-option label="2021级网络安全2班" value="202102"></el-option>
              <el-option label="2022级网络安全1班" value="202201"></el-option>
              <el-option label="2022级网络安全2班" value="202202"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model="studentForm.grade" placeholder="请输入年级" maxlength="4" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="studentForm.status">
              <el-radio label="active">激活</el-radio>
              <el-radio label="disabled">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="!studentForm.id" label="初始密码" prop="password">
            <el-input v-model="studentForm.password" type="password" placeholder="请输入初始密码" maxlength="20" show-word-limit></el-input>
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
import { studentApi } from '../../api/student'

// 页面数据
const searchKeyword = ref('')
const filterClass = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalStudents = ref(0)

// 班级列表映射
const classMap = {
  '202101': '2021级网络安全1班',
  '202102': '2021级网络安全2班',
  '202201': '2022级网络安全1班',
  '202202': '2022级网络安全2班'
}

// 学生列表数据
const students = ref([])

// 对话框数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加学生')
const studentForm = ref({
  id: '',
  studentId: '',
  name: '',
  email: '',
  phone: '',
  classId: '',
  className: '',
  grade: '',
  status: 'active',
  password: '',
  coursesCount: 0,
  experimentsCount: 0
})

// 表单验证规则
const studentRules = reactive({
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 8, max: 20, message: '学号长度在 8 到 20 个字符', trigger: 'blur' }
  ],
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
  classId: [
    { required: true, message: '请选择班级', trigger: 'change' }
  ],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' },
    { pattern: /^\d{4}$/, message: '请输入4位数字的年级', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

// 表单引用
const studentFormRef = ref()

// 加载学生列表
const loadStudents = async () => {
  try {
    const response = await studentApi.getStudents({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      classId: filterClass.value,
      status: filterStatus.value
    })
    students.value = response.data
    totalStudents.value = response.total
  } catch (error) {
    ElMessage.error('加载学生列表失败：' + error.message)
  }
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
    email: '',
    phone: '',
    classId: '',
    className: '',
    grade: '',
    status: 'active',
    password: '',
    coursesCount: 0,
    experimentsCount: 0
  }
  dialogVisible.value = true
}

// 编辑学生
const handleEditStudent = (row) => {
  dialogTitle.value = '编辑学生'
  studentForm.value = { ...row }
  delete studentForm.value.password // 编辑时不显示密码
  dialogVisible.value = true
}

// 查看学生
const handleViewStudent = (row) => {
  // TODO: 跳转到学生详情页面
  ElMessage.info('查看学生：' + row.name)
}

// 删除学生
const handleDeleteStudent = (row) => {
  ElMessageBox.confirm('确定要删除学生《' + row.name + '》吗？删除后不可恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async () => {
    try {
      await studentApi.deleteStudent(row.id)
      ElMessage.success('学生删除成功')
      loadStudents()
    } catch (error) {
      ElMessage.error('删除学生失败：' + error.message)
    }
  })
  .catch(() => {
    // 取消删除
  })
}

// 状态变更
const handleStatusChange = async (row) => {
  try {
    await studentApi.updateStudentStatus(row.id, row.status)
    ElMessage.success('学生状态更新成功')
  } catch (error) {
    ElMessage.error('更新学生状态失败：' + error.message)
    // 恢复原状态
    row.status = row.status === 'active' ? 'disabled' : 'active'
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!studentFormRef.value) return
  
  studentFormRef.value.validate(async (valid) => {
    if (valid) {
      // 获取班级名称
      if (studentForm.value.classId) {
        studentForm.value.className = classMap[studentForm.value.classId]
      }

      try {
        if (studentForm.value.id) {
          await studentApi.updateStudent(studentForm.value.id, studentForm.value)
          ElMessage.success('学生编辑成功')
        } else {
          await studentApi.createStudent(studentForm.value)
          ElMessage.success('学生添加成功')
        }
        dialogVisible.value = false
        loadStudents()
      } catch (error) {
        ElMessage.error(dialogTitle.value + '失败：' + error.message)
      }
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