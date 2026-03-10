<template>
  <Layout>
    <div class="course-manage-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">课程管理</h1>
        <p class="page-subtitle">管理您的网络安全课程</p>
      </div>

      <!-- 操作区域 -->
      <div class="operation-area">
        <div class="search-filter">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索课程名称或描述"
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
          <el-button type="primary" @click="handleSearch">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="resetSearch">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </div>
        <div class="action-buttons">
          <el-button type="success" @click="handleAddCourse">
            <i class="el-icon-plus"></i> 添加课程
          </el-button>
        </div>
      </div>

      <!-- 课程列表 -->
      <div class="course-list">
        <el-table
          :data="courses"
          stripe
          border
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'descending' }"
        >
          <el-table-column prop="id" label="课程ID" width="80" align="center"></el-table-column>
          <el-table-column prop="name" label="课程名称" min-width="180"></el-table-column>
          <el-table-column prop="description" label="课程描述" min-width="200"></el-table-column>
          <el-table-column prop="level" label="难度等级" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getLevelColor(scope.row.level)">
                {{ scope.row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="课程状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusColor(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="studentsCount" label="学生数量" width="100" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleViewCourse(scope.row)">
                <i class="el-icon-view"></i> 查看
              </el-button>
              <el-button type="warning" size="small" @click="handleEditCourse(scope.row)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteCourse(scope.row)">
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
          :total="totalCourses"
        ></el-pagination>
      </div>

      <!-- 添加/编辑课程对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="60%"
        :close-on-click-modal="false"
      >
        <el-form :model="courseForm" :rules="courseRules" ref="courseFormRef" label-width="120px">
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="courseForm.name" placeholder="请输入课程名称" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="课程描述" prop="description">
            <el-input
              v-model="courseForm.description"
              placeholder="请输入课程描述"
              type="textarea"
              rows="3"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="难度等级" prop="level">
            <el-select v-model="courseForm.level" placeholder="请选择课程难度">
              <el-option label="初级" value="初级"></el-option>
              <el-option label="中级" value="中级"></el-option>
              <el-option label="高级" value="高级"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程状态" prop="status">
            <el-radio-group v-model="courseForm.status">
              <el-radio label="published">已发布</el-radio>
              <el-radio label="draft">草稿</el-radio>
              <el-radio label="unpublished">已下架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程时长" prop="duration">
            <el-input v-model="courseForm.duration" placeholder="请输入课程总时长（如：8小时）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="课程分类" prop="category">
            <el-select v-model="courseForm.category" placeholder="请选择课程分类">
              <el-option label="Web安全" value="Web安全"></el-option>
              <el-option label="系统安全" value="系统安全"></el-option>
              <el-option label="网络安全" value="网络安全"></el-option>
              <el-option label="密码学" value="密码学"></el-option>
              <el-option label="漏洞威胁" value="漏洞威胁"></el-option>
            </el-select>
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
const totalCourses = ref(0)

// 课程列表数据
const courses = ref([])

// 对话框数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加课程')
const courseForm = ref({
  id: '',
  name: '',
  description: '',
  level: '初级',
  status: 'published',
  duration: '',
  category: 'Web安全'
})

// 表单验证规则
const courseRules = reactive({
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 100, message: '课程名称长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入课程描述', trigger: 'blur' },
    { min: 10, max: 500, message: '课程描述长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择课程难度', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择课程状态', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入课程时长', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择课程分类', trigger: 'change' }
  ]
})

// 表单引用
const courseFormRef = ref()

// 获取难度等级颜色
const getLevelColor = (level) => {
  const colorMap = {
    '初级': 'success',
    '中级': 'warning',
    '高级': 'danger'
  }
  return colorMap[level] || 'info'
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

// 加载课程列表
const loadCourses = () => {
  // TODO: 真实API接口 - 获取课程列表
  // import { getCourses } from '@/api/course'
  // try {
  //   const response = await getCourses({
  //     page: currentPage.value,
  //     pageSize: pageSize.value,
  //     keyword: searchKeyword.value,
  //     status: filterStatus.value
  //   })
  //   courses.value = response.data
  //   totalCourses.value = response.total
  // } catch (error) {
  //   ElMessage.error('加载课程列表失败：' + error.message)
  // }

  // Mock数据
  setTimeout(() => {
    const mockCourses = [
      {
        id: 1,
        name: 'SQL注入攻击',
        description: '详细介绍SQL注入攻击的原理、分类和防御技术',
        level: '中级',
        status: 'published',
        duration: '8小时',
        category: 'Web安全',
        studentsCount: 120,
        createTime: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: 'XSS与CSRF攻击',
        description: '学习跨站脚本攻击和跨站请求伪造的原理与防护',
        level: '中级',
        status: 'published',
        duration: '6小时',
        category: 'Web安全',
        studentsCount: 85,
        createTime: '2024-02-20 14:20:00'
      },
      {
        id: 3,
        name: '密码学原理与应用',
        description: '深入学习密码学的基本原理和实际应用',
        level: '高级',
        status: 'published',
        duration: '10小时',
        category: '密码学',
        studentsCount: 60,
        createTime: '2024-03-05 09:15:00'
      },
      {
        id: 4,
        name: '网络攻防实战',
        description: '通过实际攻防演练提高网络安全实战能力',
        level: '高级',
        status: 'draft',
        duration: '12小时',
        category: '网络安全',
        studentsCount: 0,
        createTime: '2024-03-18 16:45:00'
      },
      {
        id: 5,
        name: 'IDS与IPS系统',
        description: '学习入侵检测系统和入侵防护系统的配置与管理',
        level: '中级',
        status: 'published',
        duration: '8小时',
        category: '网络安全',
        studentsCount: 75,
        createTime: '2024-04-02 11:10:00'
      }
    ]

    // 模拟筛选和搜索
    let filtered = [...mockCourses]
    if (searchKeyword.value) {
      filtered = filtered.filter(course => 
        course.name.includes(searchKeyword.value) || 
        course.description.includes(searchKeyword.value)
      )
    }
    if (filterStatus.value) {
      filtered = filtered.filter(course => course.status === filterStatus.value)
    }

    totalCourses.value = filtered.length
    courses.value = filtered.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  }, 500)
}

// 搜索和筛选
const handleSearch = () => {
  currentPage.value = 1
  loadCourses()
}

const handleFilter = () => {
  currentPage.value = 1
  loadCourses()
}

const resetSearch = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  currentPage.value = 1
  loadCourses()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadCourses()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadCourses()
}

// 添加课程
const handleAddCourse = () => {
  dialogTitle.value = '添加课程'
  courseForm.value = {
    id: '',
    name: '',
    description: '',
    level: '初级',
    status: 'published',
    duration: '',
    category: 'Web安全'
  }
  dialogVisible.value = true
}

// 编辑课程
const handleEditCourse = (row) => {
  dialogTitle.value = '编辑课程'
  courseForm.value = { ...row }
  dialogVisible.value = true
}

// 查看课程
const handleViewCourse = (row) => {
  // TODO: 跳转到课程详情页面
  ElMessage.info('查看课程：' + row.name)
}

// 删除课程
const handleDeleteCourse = (row) => {
  ElMessageBox.confirm('确定要删除课程《' + row.name + '》吗？删除后不可恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    // TODO: 真实API接口 - 删除课程
    // import { deleteCourse } from '@/api/course'
    // try {
    //   await deleteCourse(row.id)
    //   ElMessage.success('课程删除成功')
    //   loadCourses()
    // } catch (error) {
    //   ElMessage.error('删除课程失败：' + error.message)
    // }

    // Mock删除
    setTimeout(() => {
      ElMessage.success('课程删除成功')
      loadCourses()
    }, 300)
  })
  .catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!courseFormRef.value) return
  
  courseFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 真实API接口 - 添加/编辑课程
      // import { createCourse, updateCourse } from '@/api/course'
      // try {
      //   if (courseForm.value.id) {
      //     await updateCourse(courseForm.value.id, courseForm.value)
      //     ElMessage.success('课程编辑成功')
      //   } else {
      //     await createCourse(courseForm.value)
      //     ElMessage.success('课程添加成功')
      //   }
      //   dialogVisible.value = false
      //   loadCourses()
      // } catch (error) {
      //   ElMessage.error(dialogTitle.value + '失败：' + error.message)
      // }

      // Mock提交
      setTimeout(() => {
        ElMessage.success(dialogTitle.value + '成功')
        dialogVisible.value = false
        loadCourses()
      }, 500)
    } else {
      return false
    }
  })
}

// 页面加载时初始化
onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.course-manage-container {
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

.course-list {
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .course-manage-container {
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