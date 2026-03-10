<template>
  <Layout>
    <div class="ranking-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">排行榜</h1>
      </div>

      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-info">
          <div class="user-avatar">
            <img src="https://via.placeholder.com/100" alt="用户头像">
            <div class="user-level">Lv.8</div>
          </div>
          <div class="user-details">
            <div class="user-name">林恒</div>
            <div class="user-class">网络安全223班</div>
            <div class="user-tasks">完成任务: 18</div>
          </div>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-label">当前排名</div>
            <div class="stat-value">#3</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">总积分</div>
            <div class="stat-value">874</div>
          </div>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-controls">
          <el-select v-model="filterOptions.timeRange" placeholder="时间范围" size="small">
            <el-option label="全部" value="all"></el-option>
            <el-option label="今日" value="today"></el-option>
            <el-option label="本周" value="week"></el-option>
            <el-option label="本月" value="month"></el-option>
          </el-select>

          <el-select v-model="filterOptions.difficulty" placeholder="实验类型" size="small">
            <el-option label="全部类型" value="all"></el-option>
            <el-option label="Web安全" value="web"></el-option>
            <el-option label="系统安全" value="system"></el-option>
            <el-option label="网络安全" value="network"></el-option>
          </el-select>

          <el-select v-model="filterOptions.status" placeholder="完成状态" size="small">
            <el-option label="全部状态" value="all"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="进行中" value="in_progress"></el-option>
          </el-select>
        </div>
      </div>

      <!-- 排行榜列表 -->
      <div class="ranking-list">
        <div class="list-header">
          <div class="header-item rank">排名</div>
          <div class="header-item user">用户</div>
          <div class="header-item level">等级</div>
          <div class="header-item score">积分</div>
          <div class="header-item completed">完成数量</div>
          <div class="header-item last-experiment">最近完成</div>
        </div>

        <div
          v-for="(user, index) in rankingUsers"
          :key="user.id"
          class="list-item"
          :class="{ 'current-user': user.id === currentUserId }"
        >
          <div class="list-item-content rank">
            <div class="rank-number" :class="getRankClass(index)">
              {{ index + 1 }}
            </div>
          </div>
          <div class="list-item-content user">
            <div class="user-avatar-small">
              <img :src="user.avatar" :alt="user.name">
            </div>
            <div class="user-name-small">{{ user.name }}</div>
            <div class="user-class-small">{{ user.className }}</div>
          </div>
          <div class="list-item-content level">
            <div class="level-badge">{{ user.level }}</div>
          </div>
          <div class="list-item-content score">
            <div class="score-value">{{ user.score }}</div>
          </div>
          <div class="list-item-content completed">
            <div class="completed-value">{{ user.completedCount }}</div>
          </div>
          <div class="list-item-content last-experiment">
            <div class="experiment-name">{{ user.lastExperiment.name }}</div>
            <div class="experiment-time">{{ user.lastExperiment.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Layout from './Layout.vue'

// 当前用户ID
const currentUserId = ref(3)

// 筛选选项
const filterOptions = ref({
  timeRange: 'all',
  difficulty: 'all',
  status: 'all'
})

// 排行榜用户数据（模拟数据，实际项目中从API获取）
const rankingUsers = ref([
  {
    id: 1,
    name: '王傅雪',
    className: '信息安全231班',
    avatar: 'https://via.placeholder.com/100',
    level: 'Lv.9',
    score: 926,
    completedCount: 20,
    lastExperiment: {
      name: 'L1 命令注入实验',
      time: '2023-02-18'
    }
  },
  {
    id: 2,
    name: '徐建国',
    className: '网络安全231班',
    avatar: 'https://via.placeholder.com/100',
    level: 'Lv.8',
    score: 899,
    completedCount: 19,
    lastExperiment: {
      name: 'SQL注入实验',
      time: '2023-02-15'
    }
  },
  {
    id: 3,
    name: '林恒',
    className: '网络安全223班',
    avatar: 'https://via.placeholder.com/100',
    level: 'Lv.8',
    score: 874,
    completedCount: 18,
    lastExperiment: {
      name: '逆向工程实验',
      time: '2023-02-20'
    }
  },
  {
    id: 4,
    name: '赵建国',
    className: '物联网安全231班',
    avatar: 'https://via.placeholder.com/100',
    level: 'Lv.7',
    score: 864,
    completedCount: 17,
    lastExperiment: {
      name: '漏洞扫描实验',
      time: '2023-02-14'
    }
  },
  {
    id: 5,
    name: '陈曦',
    className: '信息安全231班',
    avatar: 'https://via.placeholder.com/100',
    level: 'Lv.7',
    score: 837,
    completedCount: 16,
    lastExperiment: {
      name: 'Web安全实验',
      time: '2023-02-17'
    }
  }
])

// 获取排名样式类
const getRankClass = (index) => {
  if (index === 0) return 'rank-gold'
  if (index === 1) return 'rank-silver'
  if (index === 2) return 'rank-bronze'
  return ''
}

// 页面加载时获取数据
onMounted(() => {
  fetchRankingData()
})

// 获取排行榜数据
const fetchRankingData = async () => {
  try {
    // 实际项目中这里会调用真实的API
    // const response = await axios.get('/api/ranking', { params: filterOptions.value })
    // rankingUsers.value = response.data
  } catch (error) {
    console.error('获取排行榜数据失败:', error)
  }
}
</script>

<style scoped>
.ranking-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 用户信息卡片 */
.user-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar {
  position: relative;
  width: 100px;
  height: 100px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--border-color);
}

.user-level {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 2px solid rgba(15, 23, 42, 0.6);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-class, .user-tasks {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.user-stats {
  display: flex;
  gap: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-controls .el-select {
  min-width: 140px;
}

/* 排行榜列表 */
.ranking-list {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 120px 120px 1fr;
  padding: 1rem 1.5rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-primary);
}

.header-item {
  display: flex;
  align-items: center;
}

.list-item {
  display: grid;
  grid-template-columns: 80px 1fr 100px 120px 120px 1fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background: rgba(15, 23, 42, 0.8);
}

.list-item.current-user {
  background: rgba(64, 158, 255, 0.1);
  border-left: 4px solid var(--primary-color);
}

.list-item-content {
  display: flex;
  align-items: center;
}

/* 排名 */
.rank-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-primary);
}

.rank-number.rank-gold {
  background: #ffd700;
  color: #0f172a;
}

.rank-number.rank-silver {
  background: #c0c0c0;
  color: #0f172a;
}

.rank-number.rank-bronze {
  background: #cd7f32;
  color: #0f172a;
}

/* 用户信息 */
.user-avatar-small {
  width: 40px;
  height: 40px;
  margin-right: 1rem;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}

.user-name-small {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.user-class-small {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 等级 */
.level-badge {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* 积分 */
.score-value {
  font-weight: 600;
  color: var(--text-primary);
}

/* 完成数量 */
.completed-value {
  color: var(--text-primary);
}

/* 最近完成 */
.experiment-name {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.experiment-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .user-stats {
    justify-content: center;
  }

  .filter-section {
    overflow-x: auto;
  }

  .filter-controls {
    min-width: 600px;
  }

  .list-header {
    display: none;
  }

  .list-item {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.5rem;
  }

  .list-item-content {
    justify-content: space-between;
  }

  .list-item-content::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--text-secondary);
  }
}
</style>