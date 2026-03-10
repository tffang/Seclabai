<template>
  <Layout>
    <div class="experiment-manage-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">实验管理</h1>
        <p class="page-subtitle">管理平台上的所有网络安全实验</p>
      </div>

      <!-- 操作区域 -->
      <div class="operation-area">
        <div class="search-filter">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索实验名称或描述"
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
            <el-option label="已发布" value="published"></el-option>
            <el-option label="草稿" value="draft"></el-option>
            <el-option label="已下架" value="unpublished"></el-option>
          </el-select>
          <el-select
            v-model="filterDifficulty"
            placeholder="筛选难度"
            size="default"
            style="width: 150px; margin-right: 15px;"
            @change="handleFilter"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="简单" value="简单"></el-option>
            <el-option label="中等" value="中等"></el-option>
            <el-option label="困难" value="困难"></el-option>
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="resetSearch">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </div>
        <div class="action-buttons">
          <el-button type="success" @click="handleAddExperiment">
            <i class="el-icon-plus"></i> 添加实验
          </el-button>
        </div>
      </div>

      <!-- 实验列表 -->
      <div class="experiment-list">
        <el-table
          :data="experiments"
          stripe
          border
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'descending' }"
        >
          <el-table-column prop="id" label="实验ID" width="80" align="center"></el-table-column>
          <el-table-column prop="name" label="实验名称" min-width="200"></el-table-column>
          <el-table-column prop="description" label="实验描述" min-width="250"></el-table-column>
          <el-table-column prop="courseName" label="所属课程" width="150" align="center"></el-table-column>
          <el-table-column prop="difficulty" label="实验难度" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getDifficultyColor(scope.row.difficulty)">
                {{ scope.row.difficulty }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="实验类型" width="120" align="center">
            <template #default="scope">
              <el-tag type="info">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="实验状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusColor(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="passCount" label="通过人数" width="100" align="center"></el-table-column>
          <el-table-column prop="totalCount" label="参与人数" width="100" align="center"></el-table-column>
          <el-table-column prop="passRate" label="通过率" width="100" align="center">
            <template #default="scope">
              {{ (scope.row.passRate * 100).toFixed(1) }}%
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleViewExperiment(scope.row)">
                <i class="el-icon-view"></i> 查看
              </el-button>
              <el-button type="warning" size="small" @click="handleEditExperiment(scope.row)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteExperiment(scope.row)">
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
          :total="totalExperiments"
        ></el-pagination>
      </div>

      <!-- 添加/编辑实验对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="60%"
        :close-on-click-modal="false"
      >
        <el-form :model="experimentForm" :rules="experimentRules" ref="experimentFormRef" label-width="120px">
          <el-form-item label="实验名称" prop="name">
            <el-input v-model="experimentForm.name" placeholder="请输入实验名称" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="实验描述" prop="description">
            <el-input
              v-model="experimentForm.description"
              placeholder="请输入实验描述"
              type="textarea"
              rows="3"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="所属课程" prop="courseId">
            <el-select v-model="experimentForm.courseId" placeholder="请选择所属课程">
              <el-option
                v-for="course in courses"
                :key="course.id"
                :label="course.name"
                :value="course.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验难度" prop="difficulty">
            <el-select v-model="experimentForm.difficulty" placeholder="请选择实验难度">
              <el-option label="简单" value="简单"></el-option>
              <el-option label="中等" value="中等"></el-option>
              <el-option label="困难" value="困难"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验类型" prop="type">
            <el-select v-model="experimentForm.type" placeholder="请选择实验类型">
              <el-option label="Web安全" value="Web安全"></el-option>
              <el-option label="网络安全" value="网络安全"></el-option>
              <el-option label="系统安全" value="系统安全"></el-option>
              <el-option label="密码学" value="密码学"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验状态" prop="status">
            <el-radio-group v-model="experimentForm.status">
              <el-radio label="published">已发布</el-radio>
              <el-radio label="draft">草稿</el-radio>
              <el-radio label="unpublished">已下架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="实验时长" prop="duration">
            <el-input-number
              v-model="experimentForm.duration"
              :min="10"
              :max="300"
              :step="5"
              placeholder="请输入实验时长（分钟）"
              style="width: 100%;"
            ></el-input-number>
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
const filterDifficulty = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalExperiments = ref(0)

// 实验列表数据
const experiments = ref([])

// 课程列表（用于关联）
const courses = ref([
  { id: 1, name: '网络安全基础' },
  { id: 2, name: 'Web安全渗透测试' },
  { id: 3, name: '密码学原理与应用' },
  { id: 4, name: '网络攻防实战' },
  { id: 5, name: '移动应用安全' }
])

// 对话框数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加实验')
const experimentForm = ref({
  id: '',
  name: '',
  description: '',
  courseId: '',
  courseName: '',
  difficulty: '简单',
  type: 'Web安全',
  status: 'published',
  duration: 60
})

// 表单验证规则
const experimentRules = reactive({
  name: [
    { required: true, message: '请输入实验名称', trigger: 'blur' },
    { min: 2, max: 100, message: '实验名称长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入实验描述', trigger: 'blur' },
    { min: 10, max: 500, message: '实验描述长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  courseId: [
    { required: true, message: '请选择所属课程', trigger: 'change' }
  ],
  difficulty: [
    { required: true, message: '请选择实验难度', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择实验类型', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择实验状态', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入实验时长', trigger: 'change' }
  ]
})

// 表单引用
const experimentFormRef = ref()

// 获取难度颜色
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return colorMap[difficulty] || 'info'
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    'published': 'success',
    'draft': 'warning',
    'unpublished': 'info'
  }
  return colorMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'published': '已发布',
    'draft': '草稿',
    'unpublished': '已下架'
  }
  return textMap[status] || status
}

// 获取课程名称
const getCourseName = (courseId) => {
  const course = courses.value.find(item => item.id === courseId)
  return course ? course.name : '无'
}

// 加载实验列表
const loadExperiments = () => {
  // TODO: 真实API接口 - 获取实验列表
  // axios.get('/api/admin/experiments', {
  //   params: {
  //     page: currentPage.value,
  //     pageSize: pageSize.value,
  //     keyword: searchKeyword.value,
  //     status: filterStatus.value,
  //     difficulty: filterDifficulty.value
  //   }
  // })
  // .then(response => {
  //   experiments.value = response.data.data
  //   totalExperiments.value = response.data.total
  // })
  // .catch(error => {
  //   ElMessage.error('加载实验列表失败：' + error.message)
  // })

  // Mock数据
  setTimeout(() => {
    const mockExperiments = [
      {
        id: 1,
        name: 'SQL注入基础实验',
        description: '学习SQL注入的基本原理和防护方法',
        courseId: 2,
        courseName: 'Web安全渗透测试',
        difficulty: '简单',
        type: 'Web安全',
        status: 'published',
        duration: 60,
        passCount: 95,
        totalCount: 120,
        passRate: 0.79,
        createTime: '2024-01-20 14:30:00'
      },
      {
        id: 2,
        name: 'XSS跨站脚本攻击实验',
        description: '理解XSS攻击的工作原理和防御措施',
        courseId: 2,
        courseName: 'Web安全渗透测试',
        difficulty: '中等',
        type: 'Web安全',
        status: 'published',
        duration: 90,
        passCount: 82,
        totalCount: 115,
        passRate: 0.71,
        createTime: '2024-02-05 10:15:00'
      },
      {
        id: 3,
        name: '密码破解实验',
        description: '学习密码破解技术和密码安全策略',
        courseId: 3,
        courseName: '密码学原理与应用',
        difficulty: '困难',
        type: '密码学',
        status: 'published',
        duration: 120,
        passCount: 58,
        totalCount: 92,
        passRate: 0.63,
        createTime: '2024-03-10 16:45:00'
      },
      {
        id: 4,
        name: '网络嗅探与ARP欺骗实验',
        description: '掌握网络嗅探和ARP欺骗的原理与防护',
        courseId: 4,
        courseName: '网络攻防实战',
        difficulty: '困难',
        type: '网络安全',
        status: 'draft',
        duration: 150,
        passCount: 0,
        totalCount: 0,
        passRate: 0,
        createTime: '2024-03-25 09:20:00'
      },
      {
        id: 5,
        name: '文件上传漏洞实验',
        description: '学习文件上传漏洞的利用和防护方法',
        courseId: 2,
        courseName: 'Web安全渗透测试',
        difficulty: '中等',
        type: 'Web安全',
        status: 'published',
        duration: 75,
        passCount: 78,
        totalCount: 105,
        passRate: 0.74,
        createTime: '2024-04-12 13:50:00'
      }
    ]

    // 模拟筛选和搜索
    let filtered = [...mockExperiments]
    if (searchKeyword.value) {
      filtered = filtered.filter(experiment => 
        experiment.name.includes(searchKeyword.value) || 
        experiment.description.includes(searchKeyword.value)
      )
    }
    if (filterStatus.value) {
      filtered = filtered.filter(experiment => experiment.status === filterStatus.value)
    }
    if (filterDifficulty.value) {
      filtered = filtered.filter(experiment => experiment.difficulty === filterDifficulty.value)
    }

    totalExperiments.value = filtered.length
    experiments.value = filtered.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  }, 500)
}

// 搜索和筛选
const handleSearch = () => {
  currentPage.value = 1
  loadExperiments()
}

const handleFilter = () => {
  currentPage.value = 1
  loadExperiments()
}

const resetSearch = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterDifficulty.value = ''
  currentPage.value = 1
  loadExperiments()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadExperiments()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadExperiments()
}

// 添加实验
const handleAddExperiment = () => {
  dialogTitle.value = '添加实验'
  experimentForm.value = {
    id: '',
    name: '',
    description: '',
    courseId: '',
    courseName: '',
    difficulty: '简单',
    type: 'Web安全',
    status: 'published',
    duration: 60
  }
  dialogVisible.value = true
}

// 编辑实验
const handleEditExperiment = (row) => {
  dialogTitle.value = '编辑实验'
  experimentForm.value = { ...row }
  dialogVisible.value = true
}

// 查看实验
const handleViewExperiment = (row) => {
  // TODO: 跳转到实验详情页面
  ElMessage.info('查看实验：' + row.name)
}

// 删除实验
const handleDeleteExperiment = (row) => {
  ElMessageBox.confirm('确定要删除实验《' + row.name + '》吗？删除后不可恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    // TODO: 真实API接口 - 删除实验
    // axios.delete('/api/admin/experiments/' + row.id)
    // .then(() => {
    //   ElMessage.success('实验删除成功')
    //   loadExperiments()
    // })
    // .catch(error => {
    //   ElMessage.error('删除实验失败：' + error.message)
    // })

    // Mock删除
    setTimeout(() => {
      ElMessage.success('实验删除成功')
      loadExperiments()
    }, 300)
  })
  .catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!experimentFormRef.value) return
  
  experimentFormRef.value.validate((valid) => {
    if (valid) {
      // 更新课程名称
      experimentForm.value.courseName = getCourseName(experimentForm.value.courseId)
      
      // TODO: 真实API接口 - 添加/编辑实验
      // const method = experimentForm.value.id ? 'put' : 'post'
      // const url = experimentForm.value.id ? `/api/admin/experiments/${experimentForm.value.id}` : '/api/admin/experiments'
      // axios[method](url, experimentForm.value)
      // .then(() => {
      //   ElMessage.success(dialogTitle.value + '成功')
      //   dialogVisible.value = false
      //   loadExperiments()
      // })
      // .catch(error => {
      //   ElMessage.error(dialogTitle.value + '失败：' + error.message)
      // })

      // Mock提交
      setTimeout(() => {
        ElMessage.success(dialogTitle.value + '成功')
        dialogVisible.value = false
        loadExperiments()
      }, 500)
    } else {
      return false
    }
  })
}

// 页面加载时初始化
onMounted(() => {
  loadExperiments()
})
</script>

<style scoped>
.experiment-manage-container {
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

.experiment-list {
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .experiment-manage-container {
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