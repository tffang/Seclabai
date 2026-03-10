<template>
  <Layout>
    <div class="course-detail-container">
      <!-- 课程标题和状态 -->
      <div class="course-header">
        <div class="header-left">
          <el-icon class="course-icon">
            Reading
          </el-icon>
          <div class="header-info">
          <h1 class="course-title">{{ courseData.title }}</h1>
          <div class="course-status">
            <el-tag :type="courseData.statusType" size="small">{{ courseData.status }}</el-tag>
            <el-button link :icon="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'" size="small" @click="toggleFavorite">
              {{ isFavorite ? '已收藏' : '收藏课程' }}
            </el-button>
          </div>
        </div>
        </div>
      </div>

      <!-- 上部分：课程简介和视频 -->
      <div class="course-top-section">
        <!-- 课程简介 -->
        <div class="info-card intro-card">
          <!-- 课程状态和标题 -->
          <div class="course-status-section">
            <div class="course-status">
              <el-tag :type="courseData.statusType" size="small">{{ courseData.status }}</el-tag>
            </div>
            <h1 class="course-title">{{ courseData.title }}</h1>
          </div>
          
          <!-- 课程描述 -->
          <div class="course-description">
            <p>{{ courseData.description }}</p>
          </div>
          
          <!-- 课程详细信息 -->
          <div class="course-meta">
            <div class="meta-row">
              <div class="meta-item">
                <i class="el-icon-video-camera"></i>
                <span>6课时</span>
              </div>
              <div class="meta-item">
                <i class="el-icon-user"></i>
                <span>常教授</span>
              </div>
            </div>
            <div class="meta-row">
              <div class="meta-item">
                <i class="el-icon-star-on"></i>
                <span>9.7分</span>
              </div>
              <div class="meta-item">
                <i class="el-icon-s-home"></i>
                <span>Web安全</span>
              </div>
            </div>
            <div class="meta-row">
              <div class="meta-item">
                <i class="el-icon-view"></i>
                <span>3,254次观看</span>
              </div>
              <div class="meta-item">
                <i class="el-icon-time"></i>
                <span>总计3小时</span>
              </div>
            </div>
          </div>
          
          <!-- 课程资源 -->
          <div class="course-resources">
            <h4 class="resources-title">课程资源</h4>
            <div class="resource-item" @click="downloadResource('ppt')">
              <i class="el-icon-document"></i>
              <span class="resource-name">课程PPT</span>
              <i class="el-icon-download"></i>
            </div>
            <div class="resource-item" @click="downloadResource('manual')">
              <i class="el-icon-document"></i>
              <span class="resource-name">实验手册</span>
              <i class="el-icon-download"></i>
            </div>
            <div class="resource-item" @click="downloadResource('reference')">
              <i class="el-icon-document"></i>
              <span class="resource-name">参考资料</span>
              <i class="el-icon-download"></i>
            </div>
            <div class="resource-item" @click="downloadResource('video')">
              <i class="el-icon-video-camera"></i>
              <span class="resource-name">课程视频</span>
              <i class="el-icon-download"></i>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="course-actions">
            <el-button type="primary" size="large" class="start-button">
              <i class="el-icon-video-play"></i> 开始学习
            </el-button>
            <el-button :icon="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'" @click="toggleFavorite">
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
          </div>
        </div>

        <!-- 课程视频 -->
        <div class="video-card">
          <!-- 视频播放器 -->
          <div class="video-player">
            <video
              v-if="courseVideo"
              :src="courseVideo"
              class="video-element"
              controls
            >
              您的浏览器不支持HTML5视频。
            </video>
            <div v-else class="video-placeholder">
              <div class="video-content">
                <i class="el-icon-video-camera"></i>
                <div class="play-button" @click="playVideo">
                  <i class="el-icon-video-play"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- 视频信息 -->
          <div class="video-info">
            <h3 class="video-title">{{ courseData.title }}</h3>
            <div class="video-meta">
              <span class="meta-item">
                <i class="el-icon-time"></i> 3小时
              </span>
              <span class="meta-item">
                <i class="el-icon-view"></i> 3,254次观看
              </span>
              <span class="meta-item">
                <i class="el-icon-user"></i> 网络安全实验室
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 下部分：课程目录和学习进度 -->
      <div class="course-bottom-section">
        <!-- 标签页 -->
        <div class="bottom-tabs">
          <el-tabs v-model="activeBottomTab" type="card">
            <el-tab-pane label="课程目录" name="course-content"></el-tab-pane>
            <el-tab-pane label="学习进度" name="learning-progress"></el-tab-pane>
          </el-tabs>
        </div>
        
        <!-- 标签页内容 -->
        <div class="tab-content">
          <!-- 课程目录内容 -->
          <div v-if="activeBottomTab === 'course-content'" class="content-tab">
            <div class="task-list">
              <div
                v-for="(task, index) in courseData.tasks"
                :key="task.id"
                :class="[
                  'task-item',
                  task.completed ? 'completed' : '',
                  index === courseData.tasks.findIndex(t => !t.completed) ? 'current' : ''
                ]"
              >
                <div class="task-icon">
                  <i v-if="task.completed" class="el-icon-check"></i>
                  <i v-else-if="index === courseData.tasks.findIndex(t => !t.completed)" class="el-icon-video-play"></i>
                  <i v-else class="el-icon-time"></i>
                </div>
                <div class="task-content">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-meta">
                    {{ task.duration }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 学习进度内容 -->
          <div v-else-if="activeBottomTab === 'learning-progress'" class="progress-tab">
            <div class="progress-content">
              <!-- 学习进度 -->
              <div class="progress-item">
                <div class="progress-header">
                  <span class="progress-label">学习进度</span>
                  <span class="progress-value">{{ courseData.progress }}%</span>
                </div>
                <el-progress
                  type="line"
                  :percentage="courseData.progress"
                  :stroke-width="8"
                  stroke-linecap="round"
                  :color="[{color: '#4facfe', percentage: courseData.progress}]"
                />
              </div>

              <!-- 学习时间 -->
              <div class="progress-item">
                <div class="progress-header">
                  <span class="progress-label">学习时间</span>
                  <span class="progress-value">{{ courseData.totalDuration }}小时</span>
                </div>
                <div class="time-chart">
                  <div class="time-bar" :style="{height: '40%'}" title="周一: 30分钟"></div>
                  <div class="time-bar" :style="{height: '60%'}" title="周二: 45分钟"></div>
                  <div class="time-bar" :style="{height: '80%'}" title="周三: 60分钟"></div>
                  <div class="time-bar" :style="{height: '30%'}" title="周四: 20分钟"></div>
                  <div class="time-bar" :style="{height: '50%'}" title="周五: 35分钟"></div>
                  <div class="time-bar" :style="{height: '20%'}" title="周六: 15分钟"></div>
                  <div class="time-bar" :style="{height: '10%'}" title="周日: 10分钟"></div>
                </div>
              </div>

              <!-- 任务完成情况 -->
              <div class="progress-item">
                <div class="progress-header">
                  <span class="progress-label">任务完成情况</span>
                  <span class="progress-value">{{ courseData.tasks.filter(t => t.completed).length }}/{{ courseData.tasks.length }}</span>
                </div>
                <div class="task-completion">
                  <div v-for="(task, index) in courseData.tasks" :key="task.id" class="completion-item">
                    <i v-if="task.completed" class="el-icon-check"></i>
                    <i v-else-if="index === courseData.tasks.findIndex(t => !t.completed)" class="el-icon-video-play"></i>
                    <i v-else class="el-icon-time"></i>
                    <span>{{ task.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Layout from './Layout.vue'
import { Reading } from '@element-plus/icons-vue'

const route = useRoute()
const courseId = ref(route.params.id)
const activeTab = ref('course-video')
const activeBottomTab = ref('course-content')
const isFavorite = ref(false)
const courseVideo = ref('/videos/sql-injection-intro.mp4') // 示例视频路径

// 资源下载方法
const downloadResource = (type) => {
  const resources = {
    ppt: { name: 'sql-injection-course-ppt.pptx', url: '/resources/sql-injection-course-ppt.pptx' },
    manual: { name: 'sql-injection-experiment-manual.pdf', url: '/resources/sql-injection-experiment-manual.pdf' },
    reference: { name: 'sql-injection-reference-materials.zip', url: '/resources/sql-injection-reference-materials.zip' },
    video: { name: 'sql-injection-full-course.mp4', url: '/resources/sql-injection-full-course.mp4' }
  };
  
  const resource = resources[type];
  if (resource) {
    // 创建a标签进行下载
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.name;
    link.click();
  }
}

// 模拟课程数据
const mockCourses = [
  {
    id: 1,
    title: 'SQL注入攻防实战',
    description: '本课程详细介绍SQL注入攻击的原理、分类和防御技术。',
    status: '可开始',
    statusType: '',
    video: '/videos/1.1Sql注入攻击.mp4',
    tasks: [
      { id: 1, title: 'SQL注入攻击原理', completed: false, duration: '00:00' },
      { id: 2, title: 'SQL注入攻击类型', completed: false, duration: '00:00' },
      { id: 3, title: 'SQL注入攻击防范', completed: false, duration: '00:00' },
      { id: 4, title: 'SQL注入实验演示', completed: false, duration: '00:00' },
      { id: 5, title: 'SQL注入实战练习', completed: false, duration: '00:00' },
      { id: 6, title: 'SQL注入总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 2,
    title: 'XSS与CSRF攻击',
    description: '本课程深入讲解跨站脚本攻击(XSS)和跨站请求伪造(CSRF)攻击的原理和防御方法。',
    status: '可开始',
    statusType: '',
    video: '/videos/1.2Xss与csrf-.mp4',
    tasks: [
      { id: 1, title: 'XSS攻击原理', completed: false, duration: '00:00' },
      { id: 2, title: 'XSS攻击分类', completed: false, duration: '00:00' },
      { id: 3, title: 'CSRF攻击原理', completed: false, duration: '00:00' },
      { id: 4, title: 'CSRF攻击防御', completed: false, duration: '00:00' },
      { id: 5, title: 'XSS与CSRF实验', completed: false, duration: '00:00' },
      { id: 6, title: 'XSS与CSRF测试', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 3,
    title: 'IDS与IPS系统',
    description: '本课程介绍入侵检测系统(IDS)和入侵防御系统(IPS)的原理和配置方法。',
    status: '进行中',
    statusType: 'success',
    video: '/videos/1.3 IDS和IPS.mp4',
    tasks: [
      { id: 1, title: 'IDS和IPS系统概述', completed: true, duration: '08:30' },
      { id: 2, title: 'IDS工作原理', completed: true, duration: '12:45' },
      { id: 3, title: 'IPS工作原理', completed: false, duration: '15:20' },
      { id: 4, title: 'IDS和IPS配置', completed: false, duration: '00:00' },
      { id: 5, title: 'IDS和IPS实验', completed: false, duration: '00:00' },
      { id: 6, title: '课程总结与测试', completed: false, duration: '00:00' }
    ],
    progress: 33,
    totalDuration: '2:15'
  },
  {
    id: 4,
    title: 'APT攻击分析',
    description: '本课程深入分析高级持续性威胁(APT)攻击的特点、流程和防御方法。',
    status: '可开始',
    statusType: '',
    video: '/videos/1.4Apt攻击.mp4',
    tasks: [
      { id: 1, title: 'APT攻击原理', completed: false, duration: '00:00' },
      { id: 2, title: 'APT攻击检测', completed: false, duration: '00:00' },
      { id: 3, title: 'APT攻击防御', completed: false, duration: '00:00' },
      { id: 4, title: 'APT攻击案例分析', completed: false, duration: '00:00' },
      { id: 5, title: 'APT攻击应急响应', completed: false, duration: '00:00' },
      { id: 6, title: 'APT攻击总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 5,
    title: '防火墙技术',
    description: '本课程详细介绍防火墙的工作原理、配置和管理技术。',
    status: '可开始',
    statusType: '',
    video: '/videos/1.5防火墙.mp4',
    tasks: [
      { id: 1, title: '防火墙概述', completed: false, duration: '00:00' },
      { id: 2, title: '防火墙类型', completed: false, duration: '00:00' },
      { id: 3, title: '防火墙配置', completed: false, duration: '00:00' },
      { id: 4, title: '防火墙策略', completed: false, duration: '00:00' },
      { id: 5, title: '防火墙实验', completed: false, duration: '00:00' },
      { id: 6, title: '防火墙管理', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 6,
    title: '古典密码学',
    description: '本课程介绍古典密码学的基本概念和常见算法。',
    status: '可开始',
    statusType: '',
    video: '/videos/2.2 古典密码.mp4',
    tasks: [
      { id: 1, title: '密码学概述', completed: false, duration: '00:00' },
      { id: 2, title: '替换密码', completed: false, duration: '00:00' },
      { id: 3, title: '置换密码', completed: false, duration: '00:00' },
      { id: 4, title: '古典密码分析', completed: false, duration: '00:00' },
      { id: 5, title: '古典密码实验', completed: false, duration: '00:00' },
      { id: 6, title: '古典密码总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 7,
    title: '公钥密码学简介',
    description: '本课程介绍公钥密码学的基本概念和原理。',
    status: '可开始',
    statusType: '',
    video: '/videos/2.4公钥密码简介.mp4',
    tasks: [
      { id: 1, title: '公钥密码学概述', completed: false, duration: '00:00' },
      { id: 2, title: '公钥密码学原理', completed: false, duration: '00:00' },
      { id: 3, title: '公钥密码学应用', completed: false, duration: '00:00' },
      { id: 4, title: '公钥密码学安全性', completed: false, duration: '00:00' },
      { id: 5, title: '公钥密码学实验', completed: false, duration: '00:00' },
      { id: 6, title: '公钥密码学总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 8,
    title: 'RSA公钥加密方案',
    description: '本课程深入讲解RSA公钥加密方案的原理、实现和应用。',
    status: '可开始',
    statusType: '',
    video: '/videos/2.5 Rsa公钥加密方案.mp4',
    tasks: [
      { id: 1, title: 'RSA算法原理', completed: false, duration: '00:00' },
      { id: 2, title: 'RSA算法实现', completed: false, duration: '00:00' },
      { id: 3, title: 'RSA算法应用', completed: false, duration: '00:00' },
      { id: 4, title: 'RSA算法安全性', completed: false, duration: '00:00' },
      { id: 5, title: 'RSA算法实验', completed: false, duration: '00:00' },
      { id: 6, title: 'RSA算法总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 9,
    title: '数字签名技术',
    description: '本课程介绍数字签名的基本概念、原理和应用。',
    status: '可开始',
    statusType: '',
    video: '/videos/2.6数字签名.mp4',
    tasks: [
      { id: 1, title: '数字签名概述', completed: false, duration: '00:00' },
      { id: 2, title: '数字签名原理', completed: false, duration: '00:00' },
      { id: 3, title: '数字签名算法', completed: false, duration: '00:00' },
      { id: 4, title: '数字签名应用', completed: false, duration: '00:00' },
      { id: 5, title: '数字签名实验', completed: false, duration: '00:00' },
      { id: 6, title: '数字签名总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 10,
    title: '操作系统安全概述',
    description: '本课程介绍操作系统安全的基本概念和常见威胁。',
    status: '可开始',
    statusType: '',
    video: '/videos/3.2 操作系统安全概述.mp4',
    tasks: [
      { id: 1, title: '操作系统安全概述', completed: false, duration: '00:00' },
      { id: 2, title: '操作系统安全模型', completed: false, duration: '00:00' },
      { id: 3, title: '操作系统安全机制', completed: false, duration: '00:00' },
      { id: 4, title: '操作系统安全策略', completed: false, duration: '00:00' },
      { id: 5, title: '操作系统安全实验', completed: false, duration: '00:00' },
      { id: 6, title: '操作系统安全总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 11,
    title: '可信计算技术',
    description: '本课程深入讲解可信计算的基本概念、原理和应用。',
    status: '可开始',
    statusType: '',
    video: '/videos/3.4 可信计算.mp4',
    tasks: [
      { id: 1, title: '可信计算概述', completed: false, duration: '00:00' },
      { id: 2, title: '可信平台模块', completed: false, duration: '00:00' },
      { id: 3, title: '可信计算架构', completed: false, duration: '00:00' },
      { id: 4, title: '可信计算应用', completed: false, duration: '00:00' },
      { id: 5, title: '可信计算实验', completed: false, duration: '00:00' },
      { id: 6, title: '可信计算总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  },
  {
    id: 12,
    title: '网络安全概述',
    description: '本课程介绍网络安全的基本概念、常见威胁和防护措施。',
    status: '可开始',
    statusType: '',
    video: '/videos/4.1.1 网络安全概述.mp4',
    tasks: [
      { id: 1, title: '网络安全概述', completed: false, duration: '00:00' },
      { id: 2, title: '网络安全威胁', completed: false, duration: '00:00' },
      { id: 3, title: '网络安全防护', completed: false, duration: '00:00' },
      { id: 4, title: '网络安全技术', completed: false, duration: '00:00' },
      { id: 5, title: '网络安全实验', completed: false, duration: '00:00' },
      { id: 6, title: '网络安全总结', completed: false, duration: '00:00' }
    ],
    progress: 0,
    totalDuration: '00:00'
  }
]

// 响应式课程数据
const courseData = ref({
  id: 0,
  title: '',
  description: '',
  status: '',
  statusType: '',
  video: '',
  tasks: [],
  progress: 0,
  totalDuration: '00:00'
})

// 获取课程详情
onMounted(() => {
  fetchCourseDetail()
})

const fetchCourseDetail = async () => {
  try {
    // 从模拟数据中获取课程详情
    const course = mockCourses.find(c => c.id === Number(courseId.value))
    if (course) {
      courseData.value = course
      courseVideo.value = course.video
    } else {
      console.error('课程不存在')
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
  }
}

// 收藏/取消收藏课程
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // TODO: 调用API更新收藏状态
}



// 播放视频
const playVideo = () => {
  // 如果视频元素存在，直接播放
  const videoElement = document.querySelector('.video-element')
  if (videoElement) {
    videoElement.play()
  }
}
</script>

<style scoped>
/* 全局样式变量 */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --card-bg: rgba(15, 23, 42, 0.75);
  --card-hover-bg: rgba(15, 23, 42, 0.9);
  --border-color: rgba(102, 126, 234, 0.2);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

/* 主容器 */
.course-detail-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 课程标题区域 */
.course-header {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.course-header:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.course-icon {
  font-size: 2rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-info {
  flex: 1;
}

.course-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.course-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 上部分：课程简介和视频 */
.course-top-section {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* 主容器 */
.course-detail-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

/* 卡片基础样式 */
.intro-card, .video-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
}

.intro-card:hover, .video-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* 课程状态和标题 */
.course-status-section {
  margin-bottom: 2rem;
}

.course-status-section .course-status {
  margin-bottom: 1rem;
}

.course-status-section .course-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 课程描述 */
.course-description {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
  font-size: 1rem;
}

/* 课程详细信息 */
.course-meta {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.meta-item i {
  color: #667eea;
  font-size: 1.1rem;
}

.meta-item span {
  color: var(--text-primary);
  font-weight: 500;
}

/* 课程资源 */
.course-resources {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
}

.resources-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.resource-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
}

.resource-item::before {
  content: '';
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left var(--transition-normal);
}

.resource-item:hover {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(5px);
}

.resource-item:hover::before {
  left: 100%;
}

.resource-item i:first-child {
  color: #667eea;
  margin-right: 1rem;
  font-size: 1.1rem;
  z-index: 1;
}

.resource-name {
  flex: 1;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  z-index: 1;
}

.resource-item i:last-child {
  color: var(--text-secondary);
  font-size: 1rem;
  transition: all var(--transition-fast);
  z-index: 1;
}

.resource-item:hover i:last-child {
  color: #667eea;
  transform: scale(1.1);
}

/* 课程操作按钮 */
.course-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.start-button {
  width: 100%;
  font-weight: 600;
  height: 48px;
  font-size: 1.1rem;
  background: var(--primary-gradient);
  border: none;
  border-radius: 12px;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.course-actions .el-button {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  transition: all var(--transition-fast);
}

.course-actions .el-button:hover {
  transform: translateY(-2px);
}

/* 视频播放器 */
.video-card {
  display: flex;
  flex-direction: column;
}

.video-player {
  margin-bottom: 2rem;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.video-placeholder {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 12px;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 480px;
  border-radius: 12px;
  background: #000;
  object-fit: cover;
  transition: all var(--transition-normal);
}

.video-element:hover {
  cursor: pointer;
}

.video-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  color: var(--text-secondary);
  font-size: 1.3rem;
}

.video-content i {
  font-size: 4rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.7;
}

.play-button {
  width: 80px;
  height: 80px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  border: none;
}

.play-button:hover {
  transform: scale(1.15);
  box-shadow: var(--shadow-lg);
}

.play-button i {
  font-size: 2.5rem;
  color: white;
  opacity: 1;
  margin-left: 8px;
}

/* 视频信息 */
.video-info {
  padding: 0;
  flex: 1;
}

.video-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.video-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.video-description {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
}

/* 下部分：课程目录和学习进度 */
.course-bottom-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  margin-bottom: 2.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* 视频播放器 */
.video-element {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  border-radius: 12px;
  background: #000;
  object-fit: cover;
  transition: all var(--transition-normal);
}

.video-placeholder {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 12px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 标签页 */
.bottom-tabs {
  margin-bottom: 0;
}

.bottom-tabs .el-tabs {
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
}

.bottom-tabs .el-tabs__nav-wrap {
  padding: 0 2rem;
}

.bottom-tabs .el-tabs__item {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  padding: 1.5rem 1rem;
  transition: all var(--transition-fast);
}

.bottom-tabs .el-tabs__item:hover {
  color: #667eea;
}

.bottom-tabs .el-tabs__item.is-active {
  color: #667eea;
  font-weight: 600;
}

.bottom-tabs .el-tabs__active-bar {
  background: var(--primary-gradient);
  height: 3px;
}

.bottom-tabs .el-tabs__content {
  padding: 0;
}

/* 标签页内容 */
.tab-content {
  padding: 2.5rem;
}

.content-tab,
.progress-tab {
  height: 100%;
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  border-left: 4px solid rgba(102, 126, 234, 0.3);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.task-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  background: rgba(102, 126, 234, 0.05);
  transition: width var(--transition-normal);
  z-index: 0;
}

.task-item:hover {
  background: rgba(15, 23, 42, 0.7);
  transform: translateX(8px);
  box-shadow: var(--shadow-sm);
}

.task-item:hover::before {
  width: 100%;
}

.task-item.completed {
  border-left-color: #67c23a;
}

.task-item.current {
  border-left-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.task-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(15, 23, 42, 0.8);
  transition: all var(--transition-fast);
  z-index: 1;
  position: relative;
}

.task-item.completed .task-icon {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
}

.task-item.current .task-icon {
  background: var(--primary-gradient);
  color: white;
}

.task-content {
  flex: 1;
  z-index: 1;
  position: relative;
}

.task-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.task-item:hover .task-title {
  color: #667eea;
}

.task-meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.task-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 学习进度内容 */
.progress-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.progress-item {
  margin-bottom: 0;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all var(--transition-fast);
}

.progress-item:hover {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(15, 23, 42, 0.6);
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.progress-label {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.progress-value {
  font-size: 1.2rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.time-chart {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 120px;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
}

.time-bar {
  flex: 1;
  background: var(--primary-gradient);
  border-radius: 4px 4px 0 0;
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
}

.time-bar:hover {
  transform: scaleY(1.1);
  box-shadow: var(--shadow-md);
}

.time-bar::after {
  content: attr(title);
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.9);
  color: var(--text-primary);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity var(--transition-fast);
  white-space: nowrap;
  border: 1px solid var(--border-color);
}

.time-bar:hover::after {
  opacity: 1;
}

.task-completion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.completion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.completion-item i {
  font-size: 0.8rem;
}

.completion-item span {
  color: var(--text-primary);
}

.suggestion {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.suggestion i {
  font-size: 1.2rem;
  color: #409eff;
  margin-top: 0.25rem;
}

.suggestion p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .course-top-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .course-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .course-detail-container {
    padding: 0 1rem;
  }
  
  .course-header {
    padding: 1.5rem;
  }
  
  .course-title {
    font-size: 1.6rem;
  }
  
  .intro-card, .video-card {
    padding: 1.5rem;
  }
  
  .video-placeholder, .video-element {
    height: 300px;
  }
  
  .tab-content {
    padding: 1.5rem;
  }
  
  .video-meta {
    gap: 1.5rem;
  }
}
</style>