import apiClient from './config'

// 获取所有课程
export const getCourses = async () => {
  try {
    const response = await apiClient.get('/courses')
    return response
  } catch (error) {
    console.error('获取课程列表失败:', error)
    throw error
  }
}

// 获取课程详情
export const getCourseById = async (courseId) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}`)
    return response
  } catch (error) {
    console.error(`获取课程ID为${courseId}的详情失败:`, error)
    throw error
  }
}

// 创建课程
export const createCourse = async (courseData) => {
  try {
    const response = await apiClient.post('/courses', courseData)
    return response
  } catch (error) {
    console.error('创建课程失败:', error)
    throw error
  }
}

// 更新课程
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await apiClient.put(`/courses/${courseId}`, courseData)
    return response
  } catch (error) {
    console.error(`更新课程ID为${courseId}的信息失败:`, error)
    throw error
  }
}

// 上传课程视频
export const uploadCourseVideo = async (courseId, videoFile) => {
  try {
    const formData = new FormData()
    formData.append('video', videoFile)
    
    const response = await apiClient.post(`/courses/${courseId}/upload-video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response
  } catch (error) {
    console.error(`上传课程ID为${courseId}的视频失败:`, error)
    throw error
  }
}

// 上传课程视频封面
export const uploadCourseCover = async (courseId, coverFile) => {
  try {
    const formData = new FormData()
    formData.append('cover', coverFile)
    
    const response = await apiClient.post(`/courses/${courseId}/upload-cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response
  } catch (error) {
    console.error(`上传课程ID为${courseId}的视频封面失败:`, error)
    throw error
  }
}
