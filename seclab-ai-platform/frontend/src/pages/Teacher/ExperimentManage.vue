<template>
  <Layout>
    <div class="experiment-manage-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">实验管理</h1>
        <p class="page-subtitle">管理您的网络安全实验</p>
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
            v-model="filterCourse"
            placeholder="选择课程"
            size="default"
            style="width: 180px; margin-right: 15px;"
            @change="handleFilter"
          >
            <el-option label="全部课程" value=""></el-option>
            <el-option v-for="course in courseList" :key="course.id" :label="course.name" :value="course.id"></el-option>
          </el-select>
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
          <el-table-column prop="name" label="实验名称" min-width="180"></el-table-column>
          <el-table-column prop="courseName" label="所属课程" width="150" align="center"></el-table-column>
          <el-table-column prop="type" label="实验类型" width="120" align="center">
            <template #default="scope">
              <el-tag :type="getTypeColor(scope.row.type)">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="实验描述" min-width="200"></el-table-column>
          <el-table-column prop="status" label="实验状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusColor(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="studentsCount" label="参与学生" width="100" align="center"></el-table-column>
          <el-table-column prop="passRate" label="通过率" width="100" align="center">
            <template #default="scope">
              <el-progress
                :percentage="scope.row.passRate"
                :stroke-width="8"
                :show-text="true"
                :status="getPassRateStatus(scope.row.passRate)"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
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
          <el-form-item label="所属课程" prop="courseId">
            <el-select v-model="experimentForm.courseId" placeholder="请选择所属课程">
              <el-option v-for="course in courseList" :key="course.id" :label="course.name" :value="course.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验类型" prop="type">
            <el-select v-model="experimentForm.type" placeholder="请选择实验类型">
              <el-option label="Web安全" value="Web安全"></el-option>
              <el-option label="系统安全" value="系统安全"></el-option>
              <el-option label="网络安全" value="网络安全"></el-option>
              <el-option label="密码学" value="密码学"></el-option>
              <el-option label="漏洞威胁" value="漏洞威胁"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验描述" prop="description">
            <el-input
              v-model="experimentForm.description"
              placeholder="请输入实验描述"
              type="textarea"
              rows="4"
              maxlength="800"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="实验内容" prop="content">
            <el-input
              v-model="experimentForm.content"
              placeholder="请输入实验内容"
              type="textarea"
              rows="6"
              maxlength="2000"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="实验状态" prop="status">
            <el-radio-group v-model="experimentForm.status">
              <el-radio label="published">已发布</el-radio>
              <el-radio label="draft">草稿</el-radio>
              <el-radio label="unpublished">已下架</el-radio>
            </el-radio-group>
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
const filterCourse = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalExperiments = ref(0)

// 课程列表
const courseList = ref([
  { id: 1, name: 'SQL注入攻击' },
  { id: 2, name: 'XSS与CSRF攻击' },
  { id: 3, name: '密码学原理与应用' },
  { id: 4, name: '网络攻防实战' },
  { id: 5, name: 'IDS与IPS系统' }
])

// 实验列表数据
const experiments = ref([])

// 对话框数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加实验')
const experimentForm = ref({
  id: '',
  name: '',
  courseId: '',
  courseName: '',
  type: 'Web安全',
  description: '',
  content: '',
  status: 'published'
})

// 表单验证规则
const experimentRules = reactive({
  name: [
    { required: true, message: '请输入实验名称', trigger: 'blur' },
    { min: 2, max: 100, message: '实验名称长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  courseId: [
    { required: true, message: '请选择所属课程', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择实验类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入实验描述', trigger: 'blur' },
    { min: 10, max: 800, message: '实验描述长度在 10 到 800 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入实验内容', trigger: 'blur' },
    { min: 20, max: 2000, message: '实验内容长度在 20 到 2000 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择实验状态', trigger: 'change' }
  ]
})

// 表单引用
const experimentFormRef = ref()

// 获取实验类型颜色
const getTypeColor = (type) => {
  const colorMap = {
    'Web安全': 'primary',
    '系统安全': 'success',
    '网络安全': 'warning',
    '密码学': 'danger',
    '漏洞威胁': 'info'
  }
  return colorMap[type] || 'info'
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

// 获取通过率状态
const getPassRateStatus = (rate) => {
  if (rate >= 80) return 'success'
  if (rate >= 60) return 'warning'
  return 'exception'
}

// 加载实验列表
const loadExperiments = () => {
  // TODO: 真实API接口 - 获取实验列表
  // import { getExperiments } from '@/api/experiment'
  // try {
  //   const response = await getExperiments({
  //     page: currentPage.value,
  //     pageSize: pageSize.value,
  //     keyword: searchKeyword.value,
  //     courseId: filterCourse.value,
  //     status: filterStatus.value
  //   })
  //   experiments.value = response.data
  //   totalExperiments.value = response.total
  // } catch (error) {
  //   ElMessage.error('加载实验列表失败：' + error.message)
  // }

  // Mock数据
  setTimeout(() => {
    const mockExperiments = [
      {
        id: 1,
        name: 'SQL注入基础实验',
        courseId: 1,
        courseName: 'SQL注入攻击',
        type: 'Web安全',
        description: '学习基本的SQL注入攻击方法和防御措施',
        content: '1. 了解SQL注入的基本原理...\n2. 掌握联合查询注入...\n3. 学习报错注入...\n4. 实践防御措施...',
        status: 'published',
        studentsCount: 85,
        passRate: 78,
        createTime: '2024-01-20 14:30:00'
      },
      {
        id: 2,
        name: 'XSS跨站脚本攻击',
        courseId: 2,
        courseName: 'XSS与CSRF攻击',
        type: 'Web安全',
        description: '深入学习XSS攻击的分类和防御策略',
        content: '1. 了解XSS攻击的分类...\n2. 学习存储型XSS...\n3. 掌握反射型XSS...\n4. 实践DOM型XSS...\n5. 学习防御措施...',
        status: 'published',
        studentsCount: 72,
        passRate: 65,
        createTime: '2024-02-25 10:15:00'
      },
      {
        id: 3,
        name: '加密算法实践',
        courseId: 3,
        courseName: '密码学原理与应用',
        type: '密码学',
        description: '实践对称加密和非对称加密算法的应用',
        content: '1. 学习AES加密算法...\n2. 实践RSA算法...\n3. 了解哈希函数应用...\n4. 学习数字签名原理...',
        status: 'published',
        studentsCount: 58,
        passRate: 85,
        createTime: '2024-03-10 16:45:00'
      },
      {
        id: 4,
        name: '网络流量分析',
        courseId: 5,
        courseName: 'IDS与IPS系统',
        type: '网络安全',
        description: '使用Wireshark进行网络流量分析和异常检测',
        content: '1. 安装和配置Wireshark...\n2. 捕获网络流量...\n3. 分析TCP/IP协议...\n4. 识别异常流量模式...',
        status: 'draft',
        studentsCount: 0,
        passRate: 0,
        createTime: '2024-03-25 09:30:00'
      },
      {
        id: 5,
        name: 'Linux系统漏洞利用',
        courseId: 4,
        courseName: '网络攻防实战',
        type: '系统安全',
        description: '学习Linux系统常见漏洞的利用方法',
        content: '1. 了解Linux系统结构...\n2. 学习权限提升技术...\n3. 实践缓冲区溢出攻击...\n4. 学习系统加固措施...',
        status: 'published',
        studentsCount: 42,
        passRate: 58,
        createTime: '2024-04-05 13:20:00'
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
    if (filterCourse.value) {
      filtered = filtered.filter(experiment => experiment.courseId === filterCourse.value)
    }
    if (filterStatus.value) {
      filtered = filtered.filter(experiment => experiment.status === filterStatus.value)
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
  filterCourse.value = ''
  filterStatus.value = ''
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
    courseId: '',
    courseName: '',
    type: 'Web安全',
    description: '',
    content: '',
    status: 'published'
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
    // import { deleteExperiment } from '@/api/experiment'
    // try {
    //   await deleteExperiment(row.id)
    //   ElMessage.success('实验删除成功')
    //   loadExperiments()
    // } catch (error) {
    //   ElMessage.error('删除实验失败：' + error.message)
    // }

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
      // 获取课程名称
      const selectedCourse = courseList.value.find(course => course.id === experimentForm.value.courseId)
      if (selectedCourse) {
        experimentForm.value.courseName = selectedCourse.name
      }

      // TODO: 真实API接口 - 添加/编辑实验
      // import { createExperiment, updateExperiment } from '@/api/experiment'
      // try {
      //   if (experimentForm.value.id) {
      //     await updateExperiment(experimentForm.value.id, experimentForm.value)
      //     ElMessage.success('实验编辑成功')
      //   } else {
      //     await createExperiment(experimentForm.value)
      //     ElMessage.success('实验添加成功')
      //   }
      //   dialogVisible.value = false
      //   loadExperiments()
      // } catch (error) {
      //   ElMessage.error(dialogTitle.value + '失败：' + error.message)
      // }

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