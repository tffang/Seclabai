<template>
  <Layout>
    <div class="experiment-list-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">实验列表</h1>
      </div>

      <!-- 实验统计 -->
      <div class="experiment-stats">
        <div class="stat-card">
          <div class="stat-number">{{ totalExperiments }}</div>
          <div class="stat-label">总实验数</div>
        </div>
        <div class="stat-card completed">
          <div class="stat-number">{{ completedExperiments }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-card available">
          <div class="stat-number">{{ availableExperiments }}</div>
          <div class="stat-label">可开始</div>
        </div>
        <div class="stat-card locked">
          <div class="stat-number">{{ lockedExperiments }}</div>
          <div class="stat-label">未解锁</div>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-controls">
          <el-select v-model="filterOptions.type" placeholder="全部类型" size="small">
            <el-option label="全部类型" value=""></el-option>
            <el-option label="Web安全" value="web"></el-option>
            <el-option label="系统安全" value="system"></el-option>
            <el-option label="网络安全" value="network"></el-option>
          </el-select>

          <el-select v-model="filterOptions.difficulty" placeholder="全部难度" size="small">
            <el-option label="全部难度" value=""></el-option>
            <el-option label="基础" value="easy"></el-option>
            <el-option label="进阶" value="medium"></el-option>
            <el-option label="高级" value="hard"></el-option>
          </el-select>

          <el-select v-model="filterOptions.status" placeholder="全部状态" size="small">
            <el-option label="全部状态" value=""></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="可开始" value="available"></el-option>
            <el-option label="未解锁" value="locked"></el-option>
          </el-select>
        </div>

        <div class="search-box">
          <el-input
            placeholder="搜索实验名称或描述..."
            v-model="filterOptions.search"
            clearable
            size="small"
          >
            <template #prepend>
              <i class="el-icon-search"></i>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 实验列表 -->
      <div class="experiment-grid">
        <div
          v-for="experiment in filteredExperiments"
          :key="experiment.id"
          class="experiment-card"
          :class="experiment.status"
        >
          <!-- 实验标题和状态 -->
          <div class="experiment-header">
            <h3 class="experiment-title">
              <el-icon class="experiment-icon">
                <i :class="experiment.iconClass"></i>
              </el-icon>
              {{ experiment.title }}
            </h3>
            <div class="experiment-status">
              <el-tag :type="experiment.statusType" size="small">
                {{ experiment.statusText }}
              </el-tag>
            </div>
          </div>

          <!-- 实验评分和通过率 -->
          <div class="experiment-metrics">
            <div class="metric-item">
              <el-rate
                v-model="experiment.rating"
                disabled
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </div>
            <div class="metric-item">
              <span class="metric-label">通过率</span>
              <span class="metric-value">{{ experiment.passRate }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">挑战数</span>
              <span class="metric-value">{{ experiment.challengeCount }}</span>
            </div>
          </div>

          <!-- 实验描述 -->
          <p class="experiment-description">{{ experiment.description }}</p>

          <!-- 实验标签 -->
          <div class="experiment-tags">
            <el-tag v-for="tag in experiment.tags" :key="tag" size="mini">{{ tag }}</el-tag>
          </div>

          <!-- 操作按钮 -->
          <el-button
            type="primary"
            size="small"
            @click="startExperiment(experiment.id)"
            :disabled="experiment.status === 'locked'"
          >
            {{ experiment.buttonText }} <i class="el-icon-right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from './Layout.vue'

// 筛选选项
const filterOptions = ref({
  type: '',
  difficulty: '',
  status: '',
  search: ''
})

// 实验数据（模拟数据，实际项目中从API获取）
const experiments = ref([
  {
    id: 1,
    title: 'SQL注入基础实验',
    description: '学习Web安全的基本概念以及常见的漏洞类型，包括SQL注入、XSS、远程代码执行等入门知识。',
    tags: ['Web安全', '基础'],
    rating: 4.7,
    passRate: 65,
    challengeCount: 10,
    status: 'available',
    statusText: '可开始',
    statusType: 'success',
    buttonText: '开始学习',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 2,
    title: 'XSS跨站脚本攻击实验',
    description: '深入了解XSS攻击的4种类型：反射型、存储型、DOM型和XSS。',
    tags: ['Web安全', '基础'],
    rating: 4.5,
    passRate: 70,
    challengeCount: 12,
    status: 'available',
    statusText: '可开始',
    statusType: 'success',
    buttonText: '开始学习',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 3,
    title: 'CSRF跨站请求伪造实验',
    description: '了解CSRF攻击的原理和防护方法，包括Token验证、SameSite Cookie等安全措施。',
    tags: ['Web安全', '基础'],
    rating: 4.3,
    passRate: 80,
    challengeCount: 8,
    status: 'available',
    statusText: '可开始',
    statusType: 'success',
    buttonText: '开始学习',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 4,
    title: '命令注入漏洞实验',
    description: '学习命令注入漏洞的原理、危害和注入方法，实现各种命令注入攻击技术。',
    tags: ['Web安全', '进阶'],
    rating: 4.6,
    passRate: 55,
    challengeCount: 15,
    status: 'available',
    statusText: '可开始',
    statusType: 'success',
    buttonText: '开始学习',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 5,
    title: '文件上传漏洞实验',
    description: '学习文件上传漏洞的原理和利用方法，包括绕过文件类型验证、服务端漏洞等技术。',
    tags: ['Web安全', '进阶'],
    rating: 4.4,
    passRate: 60,
    challengeCount: 14,
    status: 'available',
    statusText: '可开始',
    statusType: 'success',
    buttonText: '开始学习',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 6,
    title: '目录遍历',
    description: '学习目录遍历的原理和利用方法，包括绝对路径遍历、相对路径遍历、目录列表遍历等技术。',
    tags: ['Web安全', '基础'],
    rating: 4.2,
    passRate: 85,
    challengeCount: 6,
    status: 'available',
    statusText: '可开始',
    statusType: 'success',
    buttonText: '开始学习',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 7,
    title: '组件漏洞挖掘',
    description: '学习如何挖掘和利用常见Web组件的漏洞，包括框架、库和CMS系统的安全问题。',
    tags: ['Web安全', '高级'],
    rating: 4.8,
    passRate: 45,
    challengeCount: 20,
    status: 'locked',
    statusText: '未解锁',
    statusType: '',
    buttonText: '未解锁',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 8,
    title: '业务逻辑漏洞实战',
    description: '分析和利用各种业务逻辑漏洞，包括权限控制、数据验证、流程缺陷等安全问题。',
    tags: ['Web安全', '高级'],
    rating: 4.7,
    passRate: 40,
    challengeCount: 25,
    status: 'locked',
    statusText: '未解锁',
    statusType: '',
    buttonText: '未解锁',
    iconClass: 'el-icon-document-remove'
  },
  {
    id: 9,
    title: '内网渗透技术',
    description: '学习内网渗透的各种技术和方法，包括横向移动、权限提升、持久化等高级安全技能。',
    tags: ['网络安全', '高级'],
    rating: 4.9,
    passRate: 35,
    challengeCount: 30,
    status: 'locked',
    statusText: '未解锁',
    statusType: '',
    buttonText: '未解锁',
    iconClass: 'el-icon-document-remove'
  }
])

// 计算属性
const totalExperiments = computed(() => experiments.value.length)
const completedExperiments = computed(() => experiments.value.filter(exp => exp.status === 'completed').length)
const availableExperiments = computed(() => experiments.value.filter(exp => exp.status === 'available').length)
const lockedExperiments = computed(() => experiments.value.filter(exp => exp.status === 'locked').length)

// 过滤后的实验列表
const filteredExperiments = computed(() => {
  return experiments.value.filter(experiment => {
    // 类型过滤
    if (filterOptions.value.type && !experiment.tags.includes(filterOptions.value.type)) {
      return false
    }
    
    // 难度过滤
    if (filterOptions.value.difficulty && !experiment.tags.includes(filterOptions.value.difficulty)) {
      return false
    }
    
    // 状态过滤
    if (filterOptions.value.status) {
      if (filterOptions.value.status === 'completed' && experiment.status !== 'completed') {
        return false
      }
      if (filterOptions.value.status === 'available' && experiment.status !== 'available') {
        return false
      }
      if (filterOptions.value.status === 'locked' && experiment.status !== 'locked') {
        return false
      }
    }
    
    // 搜索过滤
    if (filterOptions.value.search) {
      const search = filterOptions.value.search.toLowerCase()
      return (
        experiment.title.toLowerCase().includes(search) ||
        experiment.description.toLowerCase().includes(search)
      )
    }
    
    return true
  })
})

// 开始实验
const startExperiment = (experimentId) => {
  console.log('开始实验:', experimentId)
  // 实际项目中使用路由跳转
  // this.$router.push(`/student/experiment/${experimentId}`)
}

// 页面加载时获取数据
onMounted(() => {
  fetchExperiments()
})

// 获取实验列表
const fetchExperiments = async () => {
  try {
    // 实际项目中这里会调用真实的API
    // const response = await axios.get('/api/experiments')
    // experiments.value = response.data
  } catch (error) {
    console.error('获取实验列表失败:', error)
  }
}
</script>

<style scoped>
.experiment-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  padding: 1.5rem 0;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* 实验统计 */
.experiment-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-card.completed {
  border-color: #67c23a;
}

.stat-card.available {
  border-color: #409eff;
}

.stat-card.locked {
  border-color: #909399;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-controls .el-select {
  min-width: 140px;
}

.search-box {
  flex: 1;
  max-width: 300px;
}

/* 实验列表 */
.experiment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.experiment-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.experiment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--primary-color);
}

.experiment-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.experiment-card.locked:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--border-color);
}

.experiment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.experiment-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.experiment-icon {
  font-size: 1.3rem;
  color: var(--primary-color);
}

.experiment-metrics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.metric-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
}

.experiment-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.experiment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .experiment-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    flex-wrap: wrap;
  }

  .search-box {
    max-width: 100%;
  }

  .experiment-grid {
    grid-template-columns: 1fr;
  }
}
</style>