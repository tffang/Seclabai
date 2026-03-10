<template>
  <Layout>
    <div class="course-list-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">探索课程</h1>
        <p class="page-subtitle">发现精心设计的安全课程，开启你的学习之旅</p>
      </div>

      <!-- 课程统计 -->
      <div class="course-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="el-icon-document"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">12</div>
            <div class="stat-label">总课程</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">0</div>
            <div class="stat-label">进行中</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="el-icon-success"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">0</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="el-icon-check"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">12</div>
            <div class="stat-label">可开始</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="el-icon-star-off"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">0</div>
            <div class="stat-label">收藏</div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="filter-section">
        <div class="search-box">
          <el-input
            placeholder="搜索课程..."
            v-model="searchQuery"
            clearable
            size="medium"
            @input="handleSearch"
          >
            <template #prepend>
              <i class="el-icon-search"></i>
            </template>
          </el-input>
        </div>
        <div class="filter-controls">
          <div class="filter-tags">
            <el-tag
              v-for="filter in filters"
              :key="filter"
              :type="activeFilters.includes(filter) ? 'primary' : ''"
              @click="toggleFilter(filter)"
              size="small"
              :class="{ 'active': activeFilters.includes(filter) }"
            >
              {{ filter }}
            </el-tag>
          </div>
          <div class="difficulty-filter">
            <el-select
              v-model="activeDifficulty"
              placeholder="难度"
              size="small"
              class="difficulty-select"
            >
              <el-option
                v-for="difficulty in difficultyFilters"
                :key="difficulty"
                :label="difficulty"
                :value="difficulty"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <!-- 课程列表 -->
      <div class="course-grid">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="course-card"
          @click="viewCourseDetail(course.id)"
        >
          <!-- 课程封面 -->
          <div class="course-cover">
            <!-- 课程图片封面 -->
            <img v-if="course.image" :src="course.image" :alt="course.title" class="course-image">
            <!-- 使用渐变背景作为备选 -->
            <div v-else class="course-cover-fallback" :style="{ background: course.coverColor }"></div>
            
            <!-- 课程徽章 -->
            <div class="course-badges">
              <div v-if="course.isNew" class="badge new">新</div>
              <div v-if="course.isHot" class="badge hot">热门</div>
              <div v-if="course.isRecommended" class="badge recommended">推荐</div>
            </div>
            
            <div class="cover-content">
              <div v-if="!course.image" class="cover-icon">{{ course.icon }}</div>
              <div class="course-status">
                <el-tag :type="course.statusType" size="small">{{ course.status }}</el-tag>
              </div>
            </div>
            
            <!-- 课程收藏按钮 -->
            <div class="course-favorite" @click.stop="toggleFavorite(course)">
              <i :class="course.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
            </div>
            
            <!-- 特色标记 -->
            <div class="course-feature">
              <span class="feature-icon">{{ course.badge }}</span>
            </div>
            
            <!-- 装饰元素 -->
            <div class="cover-decoration"></div>
          </div>

          <!-- 课程信息 -->
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-rating">
              <el-rate
                v-model="course.rating"
                disabled
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
              <span class="rating-count">({{ course.studentsCount }}人学习)</span>
            </div>
            
            <!-- 进度条 -->
            <div v-if="course.progress > 0" class="course-progress">
              <div class="progress-label">
                <span>进度</span>
                <span>{{ course.progress }}%</span>
              </div>
              <el-progress :percentage="course.progress" :stroke-width="6" :show-text="false"></el-progress>
            </div>
            
            <p class="course-description">{{ course.description }}</p>
            <div class="course-meta">
              <span class="meta-item">
                <i class="el-icon-time"></i> {{ course.duration }}
              </span>
              <span class="meta-item students">
                <i class="el-icon-user"></i> {{ course.studentsCount }}
              </span>
              <span class="meta-item category" :class="'category-' + course.category">{{ course.category }}</span>
            </div>
            <el-button type="primary" size="small" class="start-button">
              {{ course.progress > 0 ? '继续学习' : '开始学习' }} <i class="el-icon-right"></i>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from './Layout.vue'

// 搜索和筛选
const searchQuery = ref('')
const activeFilters = ref([])
const filters = ['Web安全', '系统安全', '网络安全', '密码学', '漏洞威胁']
const difficultyFilters = ['全部难度', '入门', '中级', '高级']
const activeDifficulty = ref('全部难度')

// 课程数据（模拟数据，实际项目中从API获取）
const courses = ref([
  {
    id: 1,
    title: 'SQL注入攻击',
    rating: 5,
    description: '本课程详细介绍SQL注入攻击的原理、分类和防御技术...',
    duration: '8小时',
    category: 'Web安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    image: '/images/courses/sql-injection.jpg',
    icon: '🔍',
    studentsCount: 1250,
    isNew: true,
    isHot: true,
    isRecommended: false,
    badge: '🔥',
    isFavorite: false
  },
  {
    id: 2,
    title: 'XSS与CSRF攻击',
    rating: 4.5,
    description: '本课程深入讲解跨站脚本攻击(XSS)和跨站请求伪造(CSRF)攻击的原理和防御方法...',
    duration: '7小时',
    category: 'Web安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #f368e0 0%, #ee5a24 100%)',
    image: '/images/courses/xss-csrf.jpg',
    icon: '⚡',
    studentsCount: 980,
    isNew: false,
    isHot: true,
    isRecommended: true,
    badge: '⭐',
    isFavorite: true
  },
  {
    id: 3,
    title: 'IDS和IPS系统',
    rating: 4.8,
    description: '本课程介绍入侵检测系统(IDS)和入侵防护系统(IPS)的工作原理和操作流程...',
    duration: '7小时',
    category: '网络安全',
    status: '进行中',
    statusType: 'success',
    progress: 45,
    coverColor: 'linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)',
    image: '/images/courses/ids-ips.jpg',
    icon: '🛡️',
    studentsCount: 850,
    isNew: false,
    isHot: false,
    isRecommended: true,
    badge: '🏆',
    isFavorite: false
  },
  {
    id: 4,
    title: 'APT攻击分析',
    rating: 4.7,
    description: '本课程深入分析高级持续性威胁(APT)攻击的特点和防御技术...',
    duration: '10小时',
    category: '漏洞威胁',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #ff9ff3 0%, #feca57 100%)',
    icon: '🎯',
    studentsCount: 630,
    isNew: true,
    isHot: false,
    isRecommended: false,
    badge: '🆕',
    isFavorite: false
  },
  {
    id: 5,
    title: '密码学基础',
    rating: 4.9,
    description: '本课程介绍密码学的基本概念、算法和应用场景...',
    duration: '12小时',
    category: '密码学',
    status: '进行中',
    statusType: 'success',
    progress: 70,
    coverColor: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    icon: '🔐',
    studentsCount: 1520,
    isNew: false,
    isHot: true,
    isRecommended: true,
    badge: '⭐',
    isFavorite: true
  },
  {
    id: 6,
    title: '系统安全加固',
    rating: 4.6,
    description: '本课程讲解系统安全加固的方法和最佳实践...',
    duration: '9小时',
    category: '系统安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #00d2d3 0%, #00a8ff 100%)',
    icon: '🔧',
    studentsCount: 720,
    isNew: false,
    isHot: false,
    isRecommended: false,
    badge: '📚',
    isFavorite: false
  },
  {
    id: 7,
    title: '网络协议分析',
    rating: 4.4,
    description: '深入学习网络协议的工作原理和分析方法...',
    duration: '11小时',
    category: '网络安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #1dd1a1 0%, #00d2d3 100%)',
    icon: '🌐',
    studentsCount: 580,
    isNew: true,
    isHot: true,
    isRecommended: false,
    badge: '🔥',
    isFavorite: false
  },
  {
    id: 8,
    title: '安全编程实践',
    rating: 4.3,
    description: '学习如何编写安全可靠的代码，避免常见的安全漏洞...',
    duration: '10小时',
    category: '系统安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #54a0ff 0%, #00d2d3 100%)',
    icon: '💻',
    studentsCount: 450,
    isNew: false,
    isHot: false,
    isRecommended: true,
    badge: '🏆',
    isFavorite: false
  }
])

// 计算过滤后的课程
const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFilter = activeFilters.value.length === 0 ||
                         activeFilters.value.includes(course.category)
    // 暂时不实现难度过滤，因为课程数据中没有难度字段
    // const matchesDifficulty = activeDifficulty.value === '全部难度' || course.difficulty === activeDifficulty.value
    return matchesSearch && matchesFilter
  })
})

// 切换筛选条件
const toggleFilter = (filter) => {
  if (activeFilters.value.includes(filter)) {
    activeFilters.value = activeFilters.value.filter(f => f !== filter)
  } else {
    activeFilters.value.push(filter)
  }
}

// 搜索课程
const handleSearch = () => {
  // 实际项目中这里会调用API搜索
}

// 查看课程详情
const viewCourseDetail = (courseId) => {
  // 实际项目中使用路由跳转
  console.log('查看课程详情:', courseId)
  // this.$router.push(`/student/course/${courseId}`)
}

// 切换收藏状态
const toggleFavorite = (course) => {
  course.isFavorite = !course.isFavorite
  console.log(course.isFavorite ? '收藏成功' : '取消收藏')
  // 实际项目中这里会调用API更新收藏状态
}

// 页面加载时获取数据
onMounted(() => {
  fetchCourses()
})

// 获取课程列表
const fetchCourses = async () => {
  try {
    // 实际项目中这里会调用真实的API
    // const response = await axios.get('/api/courses')
    // courses.value = response.data
  } catch (error) {
    console.error('获取课程列表失败:', error)
  }
}
</script>

<style scoped>
.course-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  padding: 3rem 0 2rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(26, 32, 44, 0.9) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text-primary);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}

/* 课程统计 */
.course-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(26, 32, 44, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: statCardEnter 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }
.stat-card:nth-child(5) { animation-delay: 0.5s; }

@keyframes statCardEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-color);
  transition: all 0.3s ease;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  border-color: var(--primary-color);
}

.stat-card:hover::before {
  width: 100%;
  border-radius: 0 16px 16px 0;
  opacity: 0.1;
}

.stat-card:hover::after {
  opacity: 1;
}

.stat-card:hover .stat-number {
  transform: scale(1.1);
}

.stat-card:hover .stat-icon {
  transform: rotate(10deg) scale(1.1);
}

.stat-icon {
  font-size: 2rem;
  color: var(--primary-color);
  width: 40px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  transition: all 0.3s ease;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  transition: all 0.3s ease;
}

/* 筛选区域动画 */
.filter-section {
  animation: filterSectionEnter 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes filterSectionEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-box .el-input__inner {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-tags .el-tag {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-tags .el-tag:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 15px rgba(64, 158, 255, 0.3);
}

.filter-tags .el-tag.active {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
  animation: tagPulse 0.5s ease-out;
}

@keyframes tagPulse {
  0% { transform: translateY(-3px) scale(1.05); }
  50% { transform: translateY(-3px) scale(1.1); }
  100% { transform: translateY(-3px) scale(1.05); }
}

/* 输入反馈 */
.search-box .el-input__inner:focus {
  transform: scale(1.02);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.3);
}

/* 筛选区域 */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.search-box {
  max-width: 100%;
}

.search-box .el-input {
  border-radius: 16px;
  overflow: hidden;
}

.search-box .el-input__inner {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  height: 52px;
  font-size: 1rem;
  padding: 0 1.5rem;
}

.search-box .el-input__prepend {
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.search-box .el-input__prepend i {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.search-box .el-input__inner:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.3);
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-tags .el-tag {
  border-radius: 25px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
}

.difficulty-filter {
  min-width: 180px;
}

.difficulty-select {
  width: 100%;
  border-radius: 16px;
}

.difficulty-select .el-select__inner {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  height: 48px;
  font-size: 0.95rem;
  padding: 0 1rem;
}

.difficulty-select .el-select__inner:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.3);
}

.difficulty-select .el-select-dropdown {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin-top: 8px;
}

.difficulty-select .el-select-dropdown__item {
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px 20px;
  font-size: 0.95rem;
}

.difficulty-select .el-select-dropdown__item:hover {
  background: rgba(64, 158, 255, 0.2);
  color: var(--primary-color);
}

.difficulty-select .el-select-dropdown__item.selected {
  background: rgba(64, 158, 255, 0.3);
  color: var(--primary-color);
  font-weight: 600;
}

/* 页面加载动画 */
.course-list-container {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 课程列表 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.course-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.course-card:nth-child(1) { animation-delay: 0.1s; }
.course-card:nth-child(2) { animation-delay: 0.2s; }
.course-card:nth-child(3) { animation-delay: 0.3s; }
.course-card:nth-child(4) { animation-delay: 0.4s; }
.course-card:nth-child(5) { animation-delay: 0.5s; }
.course-card:nth-child(6) { animation-delay: 0.6s; }
.course-card:nth-child(7) { animation-delay: 0.7s; }
.course-card:nth-child(8) { animation-delay: 0.8s; }

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.course-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
}

.course-card:hover .course-cover {
  transform: scale(1.05);
}

.course-card:active {
  transform: translateY(-6px) scale(0.99);
  transition: all 0.1s ease;
}

.course-card:hover .start-button {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.4);
}

.start-button {
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.course-cover {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #000;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.course-cover:hover .course-image {
  transform: scale(1.1);
}

.course-cover-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.course-cover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 1;
}

.cover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.cover-icon {
  font-size: 4.5rem;
  color: white;
  opacity: 0.9;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

.course-status {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2;
}

.course-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.badge.new {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  animation: pulse 2s infinite;
}

.badge.hot {
  background: linear-gradient(135deg, #ff4757, #ff3737);
  color: white;
}

.badge.recommended {
  background: linear-gradient(135deg, #2ed573, #1e90ff);
  color: white;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.course-feature {
  position: absolute;
  bottom: 15px;
  right: 15px;
  z-index: 2;
}

.feature-icon {
  font-size: 2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cover-decoration {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  z-index: 1;
  animation: rotate-slow 20s linear infinite;
}

@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.course-favorite {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}

.course-favorite:hover {
  color: #ffd700;
  transform: scale(1.3);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.course-favorite i.el-icon-star-on {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.course-favorite:active {
  transform: scale(0.95);
  transition: all 0.1s ease;
}

.course-info {
  padding: 1.75rem;
  background: rgba(15, 23, 42, 0.8);
  transition: all 0.3s ease;
}

.course-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-rating {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rating-count {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.course-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: justify;
}

.course-progress {
  margin-bottom: 1.5rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.meta-item.students {
  background: rgba(64, 158, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid rgba(64, 158, 255, 0.2);
}

.start-button {
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  height: 45px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color), #337ecc);
  border: none;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.start-button:hover::before {
  left: 100%;
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.6);
  background: linear-gradient(135deg, #337ecc, var(--primary-color));
}

.start-button:active {
  transform: translateY(-1px) scale(0.98);
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.4);
  transition: all 0.1s ease;
}

.course-card:hover .course-info {
  background: rgba(15, 23, 42, 0.95);
}

.meta-item.category {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* 不同类别的颜色 */
.category-Web安全 {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(238, 90, 36, 0.2));
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.category-系统安全 {
  background: linear-gradient(135deg, rgba(0, 210, 211, 0.2), rgba(0, 168, 255, 0.2));
  color: #00d2d3;
  border: 1px solid rgba(0, 210, 211, 0.3);
}

.category-网络安全 {
  background: linear-gradient(135deg, rgba(29, 209, 161, 0.2), rgba(0, 210, 211, 0.2));
  color: #1dd1a1;
  border: 1px solid rgba(29, 209, 161, 0.3);
}

.category-密码学 {
  background: linear-gradient(135deg, rgba(162, 155, 254, 0.2), rgba(108, 92, 231, 0.2));
  color: #a29bfe;
  border: 1px solid rgba(162, 155, 254, 0.3);
}

.category-漏洞威胁 {
  background: linear-gradient(135deg, rgba(255, 159, 243, 0.2), rgba(254, 202, 87, 0.2));
  color: #ff9ff3;
  border: 1px solid rgba(255, 159, 243, 0.3);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.start-button {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .course-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-section {
    flex-direction: column;
  }

  .search-box {
    max-width: 100%;
  }

  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>