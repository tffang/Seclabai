<template>
  <Layout>
    <div class="course-list-container">
      <!-- 搜索和筛选 -->
      <div class="filter-section">
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
            
            <!-- 播放按钮 -->
            <div class="play-button">
              <i class="el-icon-video-camera"></i>
            </div>
            
            <!-- 课程评分和徽章 -->
            <div class="course-badges">
              <el-tag v-if="course.status" :type="course.statusType" size="small">{{ course.status }}</el-tag>
              <div class="course-rating" v-if="course.rating">
                <span class="star-rating">⭐️</span>
                <span class="rating-value">{{ course.rating.toFixed(1) }}</span>
              </div>
            </div>
            
            <!-- 课程标题和描述叠加层 -->
            <div class="course-overlay">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
            </div>
            
            <!-- 课程收藏按钮 -->
            <div class="course-favorite" @click.stop="toggleFavorite(course)">
              <i :class="course.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
            </div>
          </div>

          <!-- 课程信息 -->
          <div class="course-info">
            <div class="course-tags">
              <el-tag v-if="course.badge" size="mini" class="course-badge">{{ course.badge }}</el-tag>
              <span v-if="course.isNew" class="tag new-tag">新</span>
              <span v-if="course.isHot" class="tag hot-tag">热</span>
              <span v-if="course.isRecommended" class="tag recommended-tag">推</span>
            </div>
            <div class="course-meta">
              <span class="meta-item category">{{ course.category }}</span>
              <span class="meta-item">{{ course.duration }}</span>
              <span class="meta-item">{{ course.studentsCount }}人学习</span>
            </div>
            <el-button type="primary" size="small" class="start-button">
              开始学习 →
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from './Layout.vue'

const router = useRouter()

// 搜索和筛选
const activeFilters = ref([])
const filters = ['Web安全', '系统安全', '网络安全', '密码学', '漏洞威胁']

// 课程数据（模拟数据，实际项目中从API获取）
const courses = ref([
  {
    id: 1,
    title: 'SQL注入攻防实战',
    rating: 5,
    description: '本课程详细介绍SQL注入攻击的原理、分类和防御技术...',
    duration: '8小时',
    category: 'Web安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    image: '/images/courses/1.SQL注入攻防实战.png',
    icon: '🔍',
    studentsCount: 1250,
    isNew: false,
    isHot: true,
    isRecommended: false,
    badge: '🔥',
    isFavorite: false
  },
  {
    id: 2,
    title: 'XSS漏洞深度解析',
    rating: 4.5,
    description: '本课程深入讲解跨站脚本攻击(XSS)和跨站请求伪造(CSRF)攻击的原理和防御方法...',
    duration: '7小时',
    category: 'Web安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #f368e0 0%, #ee5a24 100%)',
    image: '/images/courses/2.XSS漏洞深度解析.png',
    icon: '⚡',
    studentsCount: 980,
    isNew: false,
    isHot: true,
    isRecommended: true,
    badge: '⭐',
    isFavorite: false
  },
  {
    id: 3,
    title: '文件上传漏洞突破',
    rating: 4.8,
    description: '本课程介绍文件上传漏洞的原理、分类和防御方法...',
    duration: '7小时',
    category: '网络安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)',
    image: '/images/courses/3.文件上传漏洞突破 .png',
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
    title: '中间件漏洞利用',
    rating: 4.7,
    description: '本课程深入分析中间件漏洞的特点和利用技术...',
    duration: '10小时',
    category: '漏洞威胁',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #ff9ff3 0%, #feca57 100%)',
    image: '/images/courses/4.中间件漏洞利用.png',
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
    title: '组件漏洞挖掘',
    rating: 4.9,
    description: '本课程介绍组件漏洞的挖掘方法和防御技术...',
    duration: '12小时',
    category: '密码学',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    image: '/images/courses/5.组件漏洞挖掘.png',
    icon: '🔐',
    studentsCount: 1520,
    isNew: false,
    isHot: true,
    isRecommended: true,
    badge: '⭐',
    isFavorite: false
  },
  {
    id: 6,
    title: '框架漏洞利用',
    rating: 4.6,
    description: '本课程讲解框架漏洞的利用方法和防御技术...',
    duration: '9小时',
    category: '系统安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #00d2d3 0%, #00a8ff 100%)',
    image: '/images/courses/6.框架漏洞利用.png',
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
    image: '/images/courses/7.业务逻辑漏洞实战.png',
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
    image: '/images/courses/8.内网渗透技术.png',
    icon: '💻',
    studentsCount: 450,
    isNew: false,
    isHot: false,
    isRecommended: true,
    badge: '🏆',
    isFavorite: false
  },
  {
    id: 9,
    title: '防火墙技术',
    rating: 4.7,
    description: '本课程详细介绍防火墙的工作原理、配置和管理技术...',
    duration: '8小时',
    category: '网络安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    image: '/images/courses/9.代码审计进阶.png',
    icon: '🔥',
    studentsCount: 680,
    isNew: false,
    isHot: true,
    isRecommended: false,
    badge: '🔥',
    isFavorite: false
  },
  {
    id: 10,
    title: 'RSA加密算法',
    rating: 4.9,
    description: '深入学习RSA加密算法的原理、实现和应用...',
    duration: '9小时',
    category: '密码学',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    image: '/images/courses/10.CTF攻防实战.png',
    icon: '🔐',
    studentsCount: 920,
    isNew: true,
    isHot: true,
    isRecommended: true,
    badge: '⭐',
    isFavorite: false
  },
  {
    id: 11,
    title: '漏洞扫描与评估',
    rating: 4.5,
    description: '学习如何使用漏洞扫描工具识别和评估系统安全漏洞...',
    duration: '10小时',
    category: '漏洞威胁',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    image: '/images/courses/11.红队武器库.png',
    icon: '🔍',
    studentsCount: 520,
    isNew: false,
    isHot: false,
    isRecommended: false,
    badge: '📚',
    isFavorite: false
  },
  {
    id: 12,
    title: '移动应用安全',
    rating: 4.6,
    description: '本课程讲解移动应用安全的常见威胁和防护措施...',
    duration: '8小时',
    category: 'Web安全',
    status: '可开始',
    statusType: '',
    progress: 0,
    coverColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    image: '/images/courses/12.漏洞挖掘方法论.png',
    icon: '📱',
    studentsCount: 780,
    isNew: true,
    isHot: false,
    isRecommended: true,
    badge: '🆕',
    isFavorite: false
  }
])

// 计算过滤后的课程
const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesFilter = activeFilters.value.length === 0 ||
                         activeFilters.value.includes(course.category)
    return matchesFilter
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

// 查看课程详情
const viewCourseDetail = (courseId) => {
  // 实际项目中使用路由跳转
  console.log('查看课程详情:', courseId)
  router.push(`/student/course/${courseId}`)
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
  max-width: 1400px;
  margin: 0 auto;
}

/* 筛选区域动画 */
.filter-section {
  animation: filterSectionEnter 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  margin-top: 2rem;
}

@keyframes filterSectionEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* 筛选区域 */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.filter-controls {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 3.5rem;
}

.course-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(64, 158, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.course-card:nth-child(1) { animation-delay: 0.1s; }
.course-card:nth-child(2) { animation-delay: 0.2s; }
.course-card:nth-child(3) { animation-delay: 0.3s; }
.course-card:nth-child(4) { animation-delay: 0.4s; }
.course-card:nth-child(5) { animation-delay: 0.5s; }
.course-card:nth-child(6) { animation-delay: 0.6s; }
.course-card:nth-child(7) { animation-delay: 0.7s; }
.course-card:nth-child(8) { animation-delay: 0.8s; }
.course-card:nth-child(9) { animation-delay: 0.9s; }
.course-card:nth-child(10) { animation-delay: 1.0s; }
.course-card:nth-child(11) { animation-delay: 1.1s; }
.course-card:nth-child(12) { animation-delay: 1.2s; }

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
  border-color: rgba(64, 158, 255, 0.4);
}

.course-card:active {
  transform: translateY(-4px);
  transition: all 0.1s ease;
}

.course-cover {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #000;
  flex-shrink: 0;
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

/* 播放按钮（已隐藏） */
.play-button {
  display: none;
}

/* 课程徽章 */
.course-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 课程评分 */
.course-rating {
  background: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.star-rating {
  font-size: 0.9rem;
}

.rating-value {
  font-weight: 700;
}

/* 课程叠加层 */
.course-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 1.5rem 1.25rem 1rem;
  z-index: 2;
}

.course-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 课程收藏按钮 */
.course-favorite {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  padding: 6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
}

.course-favorite:hover {
  color: #ffd700;
  transform: scale(1.2);
}

.course-favorite i.el-icon-star-on {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.course-info {
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.8);
  transition: all 0.3s ease;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 课程标签 */
.course-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.course-badge {
  background: rgba(0, 0, 0, 0.5) !important;
  color: #fff !important;
  border: none !important;
}

.tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  display: inline-block;
}

.new-tag {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.hot-tag {
  background: linear-gradient(135deg, #feca57, #ff9ff3);
}

.recommended-tag {
  background: linear-gradient(135deg, #48dbfb, #00d2d3);
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: auto;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  padding-bottom: 1.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.meta-item.category {
  background: rgba(64, 158, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid rgba(64, 158, 255, 0.3);
  color: #4facfe;
  font-size: 0.75rem;
}

.start-button {
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  height: 42px;
  font-size: 0.95rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(79, 172, 254, 0.6);
}

.start-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.4);
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