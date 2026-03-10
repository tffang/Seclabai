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
            <h1 class="course-title">IDS和IPS系统</h1>
            <div class="course-status">
              <el-tag type="success" size="small">进行中</el-tag>
              <el-button link icon="el-icon-star-off" size="small" @click="toggleFavorite">
                收藏课程
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程内容区域 -->
      <div class="course-content">
        <!-- 左侧：课程信息 -->
        <div class="course-info-section">
          <!-- 课程简介 -->
          <div class="info-card">
            <h3 class="section-title">课程简介</h3>
            <p class="section-content">
              本课程介绍入侵检测系统(IDS)和入侵防护系统(IPS)的工作原理和操作流程，
              通过分析网络流量和攻击行为，识别和防御各种网络攻击，
              提供网络流量监控、攻击特征检测、威胁行为分析等技术，
              帮助学员构建有效的网络安全防护体系。
            </p>
          </div>

          <!-- 课程目标 -->
          <div class="info-card">
            <h3 class="section-title">课程目标</h3>
            <div class="target-list">
              <div class="target-item">
                <i class="el-icon-check"></i>
                <span>IDS</span>
              </div>
              <div class="target-item">
                <i class="el-icon-check"></i>
                <span>IPS</span>
              </div>
              <div class="target-item">
                <i class="el-icon-check"></i>
                <span>网络安全</span>
              </div>
            </div>
          </div>

          <!-- 课程资源 -->
          <div class="info-card">
            <h3 class="section-title">课程资源</h3>
            <div class="resource-list">
              <div class="resource-item">
                <i class="el-icon-document"></i>
                <div class="resource-info">
                  <span class="resource-name">课程PPT</span>
                  <span class="resource-size">2.5MB</span>
                </div>
                <el-button link icon="el-icon-download" size="small" @click="downloadResource">下载</el-button>
              </div>
              <div class="resource-item">
                <i class="el-icon-document-copy"></i>
                <div class="resource-info">
                  <span class="resource-name">实验手册</span>
                  <span class="resource-size">1.8MB</span>
                </div>
                <el-button type="text" icon="el-icon-download" size="small" @click="downloadResource">下载</el-button>
              </div>
              <div class="resource-item">
                <i class="el-icon-document"></i>
                <div class="resource-info">
                  <span class="resource-name">参考资料</span>
                  <span class="resource-size">3.2MB</span>
                </div>
                <el-button type="text" icon="el-icon-download" size="small" @click="downloadResource">下载</el-button>
              </div>
              <div class="resource-item">
                <i class="el-icon-video-camera"></i>
                <div class="resource-info">
                  <span class="resource-name">课程视频</span>
                  <span class="resource-size">100MB</span>
                </div>
                <el-button type="text" icon="el-icon-download" size="small" @click="downloadResource">下载</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：课程视频 -->
        <div class="video-section">
          <div class="video-card">
            <div class="video-tabs">
              <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="课程视频" name="course-video"></el-tab-pane>
                <el-tab-pane label="笔记讨论" name="notes"></el-tab-pane>
              </el-tabs>
            </div>

            <!-- 视频播放器 -->
            <div class="video-player">
              <video
                v-if="courseVideo"
                :src="courseVideo"
                class="video-element"
                controls
                poster="/images/courses/video-placeholder.jpg"
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
              <h3 class="video-title">IDS和IPS系统 - 课程介绍</h3>
              <div class="video-meta">
                <span class="meta-item">
                  <i class="el-icon-time"></i> 10:28
                </span>
                <span class="meta-item">
                  <i class="el-icon-view"></i> 3,254次观看
                </span>
                <span class="meta-item">
                  <i class="el-icon-user"></i> 网络安全实验室
                </span>
              </div>
              <p class="video-description">
                本视频介绍了课程的主要内容、学习目标和实验环境。通过观看，您将了解如何高效地完成课程学习，以及获取相关的实验经验。
              </p>
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
const isFavorite = ref(false)
const courseVideo = ref('/videos/sql-injection-intro.mp4') // 示例视频路径

// 获取课程详情
onMounted(() => {
  fetchCourseDetail()
})

const fetchCourseDetail = async () => {
  try {
    // 实际项目中这里会调用真实的API
    // const response = await axios.get(`/api/courses/${courseId.value}`)
    // const data = response.data
    // 处理数据
  } catch (error) {
    console.error('获取课程详情失败:', error)
  }
}

// 收藏/取消收藏课程
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // TODO: 调用API更新收藏状态
}

// 下载课程资源
const downloadResource = (resourceId) => {
  // TODO: 调用API下载资源
  console.log('下载资源:', resourceId)
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
.course-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.course-header {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.course-icon {
  font-size: 2rem;
  color: var(--primary-color);
}

.header-info {
  flex: 1;
}

.course-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.course-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.course-content {
  display: grid;
  grid-template-columns: 1fr 600px;
  gap: 2rem;
}

/* 课程信息区域 */
.course-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.section-content {
  color: var(--text-secondary);
  line-height: 1.6;
}

.target-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.target-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.target-item i {
  color: #67c23a;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.resource-item:hover {
  background: rgba(15, 23, 42, 0.6);
}

.resource-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-right: 1rem;
}

.resource-info {
  flex: 1;
}

.resource-name {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.resource-size {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 视频区域 */
.video-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.video-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.video-tabs {
  margin-bottom: 1.5rem;
}

.video-player {
  margin-bottom: 1.5rem;
}

.video-placeholder {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 8px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 340px;
  border-radius: 8px;
  background: #000;
  object-fit: cover;
}

.video-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.video-content i {
  font-size: 3rem;
  color: var(--primary-color);
  opacity: 0.5;
}

.play-button {
  width: 60px;
  height: 60px;
  background: rgba(64, 158, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(64, 158, 255, 1);
  transform: scale(1.1);
}

.play-button i {
  font-size: 2rem;
  color: white;
  opacity: 1;
  margin-left: 5px;
}

.video-info {
  padding: 1rem 0;
}

.video-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.video-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.video-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .course-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .course-header {
    padding: 1rem;
  }

  .course-title {
    font-size: 1.5rem;
  }

  .info-card {
    padding: 1rem;
  }

  .video-card {
    padding: 1rem;
  }

  .video-placeholder {
    height: 200px;
  }
}
</script>