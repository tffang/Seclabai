import apiClient from './config'

// 用户相关API
export const userApi = {
  // 登录
  login: async (credentials) => {
    return await apiClient.post('/auth/login', credentials)
  },
  
  // 注册
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData)
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    return await apiClient.get('/user/me')
  },
  
  // 更新用户信息
  updateUserInfo: async (userData) => {
    return await apiClient.put('/user/me', userData)
  },
  
  // 修改密码
  changePassword: async (passwordData) => {
    return await apiClient.put('/user/change-password', passwordData)
  },
  
  // 获取用户学习统计
  getLearningStats: async () => {
    return await apiClient.get('/user/learning-stats')
  },
  
  // 上传头像
  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await apiClient.post('/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
