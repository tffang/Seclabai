<template>
  <Layout>
    <div class="class-manage-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">班级管理</h1>
        <p class="page-subtitle">管理平台上的所有学生班级</p>
      </div>

      <!-- 操作区域 -->
      <div class="operation-area">
        <div class="search-filter">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索班级名称"
            prefix-icon="el-icon-search"
            size="default"
            style="width: 300px; margin-right: 15px;"
            @keyup.enter="handleSearch"
          ></el-input>
          <el-select
            v-model="filterStatus"
            placeholder="筛选状态"
            size="default"
            style="width: 150px; margin-right: 15px;"
            @change="handleFilter"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="normal"></el-option>
            <el-option label="已毕业" value="graduated"></el-option>
            <el-option label="已解散" value="dissolved"></el-option>
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="resetSearch">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </div>
        <div class="action-buttons">
          <el-button type="success" @click="handleAddClass">
            <i class="el-icon-plus"></i> 添加班级
          </el-button>
        </div>
      </div>

      <!-- 班级列表 -->
      <div class="class-list">
        <el-table
          :data="classes"
          stripe
          border
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'descending' }"
        >
          <el-table-column prop="id" label="班级ID" width="80" align="center"></el-table-column>
          <el-table-column prop="name" label="班级名称" width="180"></el-table-column>
          <el-table-column prop="classCode" label="班级代码" width="120" align="center"></el-table-column>
          <el-table-column prop="班主任" label="班主任" width="120" align="center"></el-table-column>
          <el-table-column prop="studentCount" label="学生数量" width="100" align="center"></el-table-column>
          <el-table-column prop="courseCount" label="开设课程" width="100" align="center"></el-table-column>
          <el-table-column prop="status" label="班级状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusColor(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdYear" label="创建年份" width="100" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleViewClass(scope.row)">
                <i class="el-icon-view"></i> 查看
              </el-button>
              <el-button type="warning" size="small" @click="handleEditClass(scope.row)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteClass(scope.row)">
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
          :total="totalClasses"
        ></el-pagination>
      </div>

      <!-- 添加/编辑班级对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <el-form :model="classForm" :rules="classRules" ref="classFormRef" label-width="120px">
          <el-form-item label="班级名称" prop="name">
            <el-input v-model="classForm.name" placeholder="请输入班级名称" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="班级代码" prop="classCode">
            <el-input v-model="classForm.classCode" placeholder="请输入班级代码" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="班主任" prop="班主任">
            <el-input v-model="classForm.班主任" placeholder="请输入班主任姓名" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="创建年份" prop="createdYear">
            <el-input-number
              v-model="classForm.createdYear"
              :min="2000"
              :max="new Date().getFullYear()"
              placeholder="请输入创建年份"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="班级状态" prop="status">
            <el-radio-group v-model="classForm.status">
              <el-radio label="normal">正常</el-radio>
              <el-radio label="graduated">已毕业</el-radio>
              <el-radio label="dissolved">已解散</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="班级描述" prop="description">
            <el-input
              v-model="classForm.description"
              placeholder="请输入班级描述"
              type="textarea"
              rows="3"
              maxlength="200"
              show-word-limit
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
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalClasses = ref(0)

// 班级列表数据
const classes = ref([])

// 对话框数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加班级')
const classForm = ref({
  id: '',
  name: '',
  classCode: '',
  班主任: '',
  studentCount: 0,
  courseCount: 0,
  status: 'normal',
  createdYear: new Date().getFullYear(),
  description: ''
})

// 表单验证规则
const classRules = reactive({
  name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 2, max: 50, message: '班级名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  classCode: [
    { required: true, message: '请输入班级代码', trigger: 'blur' },
    { min: 2, max: 20, message: '班级代码长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  班主任: [
    { required: true, message: '请输入班主任姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '班主任姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  createdYear: [
    { required: true, message: '请输入创建年份', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择班级状态', trigger: 'change' }
  ]
})

// 表单引用
const classFormRef = ref()

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    'normal': 'success',
    'graduated': 'warning',
    'dissolved': 'info'
  }
  return colorMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'normal': '正常',
    'graduated': '已毕业',
    'dissolved': '已解散'
  }
  return textMap[status] || status
}

// 加载班级列表
const loadClasses = () => {
  // TODO: 真实API接口 - 获取班级列表
  // axios.get('/api/admin/classes', {
  //   params: {
  //     page: currentPage.value,
  //     pageSize: pageSize.value,
  //     keyword: searchKeyword.value,
  //     status: filterStatus.value
  //   }
  // })
  // .then(response => {
  //   classes.value = response.data.data
  //   totalClasses.value = response.data.total
  // })
  // .catch(error => {
  //   ElMessage.error('加载班级列表失败：' + error.message)
  // })

  // Mock数据
  setTimeout(() => {
    const mockClasses = [
      {
        id: 1,
        name: '网络安全1班',
        classCode: 'NS202401',
        班主任: '张教授',
        studentCount: 45,
        courseCount: 8,
        status: 'normal',
        createdYear: 2024,
        description: '网络安全专业2024级1班',
        createTime: '2024-09-01 09:00:00'
      },
      {
        id: 2,
        name: '网络安全2班',
        classCode: 'NS202402',
        班主任: '李老师',
        studentCount: 42,
        courseCount: 8,
        status: 'normal',
        createdYear: 2024,
        description: '网络安全专业2024级2班',
        createTime: '2024-09-01 09:00:00'
      },
      {
        id: 3,
        name: '网络安全3班',
        classCode: 'NS202301',
        班主任: '王教授',
        studentCount: 48,
        courseCount: 10,
        status: 'normal',
        createdYear: 2023,
        description: '网络安全专业2023级1班',
        createTime: '2023-09-01 09:00:00'
      },
      {
        id: 4,
        name: '信息安全班',
        classCode: 'IS202401',
        班主任: '赵老师',
        studentCount: 38,
        courseCount: 8,
        status: 'normal',
        createdYear: 2024,
        description: '信息安全专业2024级1班',
        createTime: '2024-09-01 09:00:00'
      },
      {
        id: 5,
        name: '网络安全2022级',
        classCode: 'NS202201',
        班主任: '钱教授',
        studentCount: 40,
        courseCount: 12,
        status: 'graduated',
        createdYear: 2022,
        description: '网络安全专业2022级1班',
        createTime: '2022-09-01 09:00:00'
      }
    ]

    // 模拟筛选和搜索
    let filtered = [...mockClasses]
    if (searchKeyword.value) {
      filtered = filtered.filter(item => item.name.includes(searchKeyword.value))
    }
    if (filterStatus.value) {
      filtered = filtered.filter(item => item.status === filterStatus.value)
    }

    totalClasses.value = filtered.length
    classes.value = filtered.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  }, 500)
}

// 搜索和筛选
const handleSearch = () => {
  currentPage.value = 1
  loadClasses()
}

const handleFilter = () => {
  currentPage.value = 1
  loadClasses()
}

const resetSearch = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  currentPage.value = 1
  loadClasses()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadClasses()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadClasses()
}

// 添加班级
const handleAddClass = () => {
  dialogTitle.value = '添加班级'
  classForm.value = {
    id: '',
    name: '',
    classCode: '',
    班主任: '',
    studentCount: 0,
    courseCount: 0,
    status: 'normal',
    createdYear: new Date().getFullYear(),
    description: ''
  }
  dialogVisible.value = true
}

// 编辑班级
const handleEditClass = (row) => {
  dialogTitle.value = '编辑班级'
  classForm.value = { ...row }
  dialogVisible.value = true
}

// 查看班级
const handleViewClass = (row) => {
  // TODO: 跳转到班级详情页面
  ElMessage.info('查看班级：' + row.name)
}

// 删除班级
const handleDeleteClass = (row) => {
  ElMessageBox.confirm('确定要删除班级《' + row.name + '》吗？删除后不可恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    // TODO: 真实API接口 - 删除班级
    // axios.delete('/api/admin/classes/' + row.id)
    // .then(() => {
    //   ElMessage.success('班级删除成功')
    //   loadClasses()
    // })
    // .catch(error => {
    //   ElMessage.error('删除班级失败：' + error.message)
    // })

    // Mock删除
    setTimeout(() => {
      ElMessage.success('班级删除成功')
      loadClasses()
    }, 300)
  })
  .catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!classFormRef.value) return
  
  classFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 真实API接口 - 添加/编辑班级
      // const method = classForm.value.id ? 'put' : 'post'
      // const url = classForm.value.id ? `/api/admin/classes/${classForm.value.id}` : '/api/admin/classes'
      // axios[method](url, classForm.value)
      // .then(() => {
      //   ElMessage.success(dialogTitle.value + '成功')
      //   dialogVisible.value = false
      //   loadClasses()
      // })
      // .catch(error => {
      //   ElMessage.error(dialogTitle.value + '失败：' + error.message)
      // })

      // Mock提交
      setTimeout(() => {
        ElMessage.success(dialogTitle.value + '成功')
        dialogVisible.value = false
        loadClasses()
      }, 500)
    } else {
      return false
    }
  })
}

// 页面加载时初始化
onMounted(() => {
  loadClasses()
})
</script>

<style scoped>
.class-manage-container {
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

.class-list {
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .class-manage-container {
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