<template>
  <Layout>
    <div class="admin-dashboard-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">管理员首页</h1>
        <p class="page-subtitle">欢迎回来，查看系统运行状态和统计信息</p>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon stat-courses">
            <i class="el-icon-collection"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.courses }}</div>
            <div class="stat-label">课程总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-experiments">
            <i class="el-icon-connection"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.experiments }}</div>
            <div class="stat-label">实验总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-students">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.students }}</div>
            <div class="stat-label">学生总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-classes">
            <i class="el-icon-office-building"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.classes }}</div>
            <div class="stat-label">班级总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-active-users">
            <i class="el-icon-circle-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.activeUsers }}</div>
            <div class="stat-label">今日活跃</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-completed-experiments">
            <i class="el-icon-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completedExperiments }}</div>
            <div class="stat-label">今日完成实验</div>
          </div>
        </div>
      </div>

      <!-- 数据图表区域 -->
      <div class="charts-section">
        <!-- 左侧图表 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">最近7天用户活跃度</h3>
          </div>
          <div class="chart-content">
            <div class="placeholder-chart">
              <i class="el-icon-data-line"></i>
              <p>活跃度折线图</p>
            </div>
          </div>
        </div>

        <!-- 右侧图表 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">课程学习人数分布</h3>
          </div>
          <div class="chart-content">
            <div class="placeholder-chart">
              <i class="el-icon-data-analysis"></i>
              <p>课程学习人数柱状图</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近动态区域 -->
      <div class="recent-activities">
        <div class="activity-header">
          <h3 class="activity-title">最近系统动态</h3>
          <el-button type="primary" link @click="loadMoreActivities">查看更多</el-button>
        </div>
        <div class="activity-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon" :class="getActivityIconClass(activity.type)">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-text">{{ activity.text }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Layout from './Layout.vue'

// 统计数据
const stats = reactive({
  courses: 0,
  experiments: 0,
  students: 0,
  classes: 0,
  activeUsers: 0,
  completedExperiments: 0
})

// 最近动态
const recentActivities = ref([])

// 加载统计数据
const loadStats = () => {
  // TODO: 真实API接口 - 获取统计数据
  // axios.get('/api/admin/dashboard/stats')
  // .then(response => {
  //   Object.assign(stats, response.data)
  // })
  // .catch(error => {
  //   ElMessage.error('加载统计数据失败：' + error.message)
  // })

  // Mock数据
  setTimeout(() => {
    stats.courses = 15
    stats.experiments = 45
    stats.students = 528
    stats.classes = 12
    stats.activeUsers = 86
    stats.completedExperiments = 132
  }, 500)
}

// 加载最近动态
const loadRecentActivities = () => {
  // TODO: 真实API接口 - 获取最近动态
  // axios.get('/api/admin/dashboard/activities', {
  //   params: { limit: 10 }
  // })
  // .then(response => {
  //   recentActivities.value = response.data
  // })
  // .catch(error => {
  //   ElMessage.error('加载最近动态失败：' + error.message)
  // })

  // Mock数据
  setTimeout(() => {
    recentActivities.value = [
      {
        id: 1,
        type: 'course',
        icon: 'el-icon-collection',
        text: '新创建了课程《Web安全高级防护技术》',
        time: '2024-11-15 14:30:00'
      },
      {
        id: 2,
        type: 'student',
        icon: 'el-icon-user-plus',
        text: '学生王五注册了账号',
        time: '2024-11-15 11:20:00'
      },
      {
        id: 3,
        type: 'experiment',
        icon: 'el-icon-connection',
        text: '实验《SQL注入高级利用》发布完成',
        time: '2024-11-14 16:45:00'
      },
      {
        id: 4,
        type: 'class',
        icon: 'el-icon-office-building',
        text: '创建了新班级《网络安全精英班》',
        time: '2024-11-14 10:15:00'
      },
      {
        id: 5,
        type: 'student',
        icon: 'el-icon-check',
        text: '学生张三完成了实验《XSS攻击与防御》',
        time: '2024-11-13 15:30:00'
      },
      {
        id: 6,
        type: 'course',
        icon: 'el-icon-edit',
        text: '更新了课程《密码学原理与应用》的内容',
        time: '2024-11-13 09:20:00'
      }
    ]
  }, 300)
}

// 加载更多动态
const loadMoreActivities = () => {
  ElMessage.info('加载更多动态功能开发中...')
}

// 获取活动图标样式类
const getActivityIconClass = (type) => {
  const iconMap = {
    'course': 'activity-course',
    'experiment': 'activity-experiment',
    'student': 'activity-student',
    'class': 'activity-class'
  }
  return iconMap[type] || 'activity-default'
}

// 页面加载时初始化
onMounted(() => {
  loadStats()
  loadRecentActivities()
})
</script>

<style scoped>
.admin-dashboard-container {
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

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  color: white;
}

.stat-courses {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-experiments {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-students {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-classes {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-active-users {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-completed-experiments {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.chart-content {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-chart {
  text-align: center;
  color: var(--text-secondary);
}

.placeholder-chart i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

/* 最近动态 */
.recent-activities {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.activity-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  border-left: 3px solid var(--primary-color);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
}

.activity-course {
  background: #667eea;
}

.activity-experiment {
  background: #f5576c;
}

.activity-student {
  background: #4facfe;
}

.activity-class {
  background: #43e97b;
}

.activity-default {
  background: var(--primary-color);
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.activity-time {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-dashboard-container {
    padding: 1rem;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .chart-content {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}
</style>