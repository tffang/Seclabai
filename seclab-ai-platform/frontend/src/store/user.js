import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { userApi } from '../api/user'

export const useUserStore = defineStore('user', {
  // 状态定义
  state: () => ({
    // 用户基本信息
    userInfo: null,
    // 登录状态
    isLoggedIn: false,
    // 角色信息
    role: '',
    // 学习统计数据
    learningStats: {
      completedCourses: 0,
      totalScore: 0,
      ranking: 0,
      consecutiveDays: 0
    },
    // 加载状态
    loading: false
  }),
  
  // Getters
  getters: {
    // 获取用户信息
    getUserInfo: (state) => state.userInfo,
    
    // 获取登录状态
    getLoginStatus: (state) => state.isLoggedIn,
    
    // 获取角色信息
    getRole: (state) => state.role,
    
    // 获取学习统计
    getLearningStats: (state) => state.learningStats,
    
    // 获取加载状态
    getLoading: (state) => state.loading,
    
    // 是否为学生
    isStudent: (state) => state.role === 'student',
    
    // 是否为教师
    isTeacher: (state) => state.role === 'teacher',
    
    // 是否为管理员
    isAdmin: (state) => state.role === 'admin'
  },
  
  // Actions
  actions: {
    // 设置加载状态
    setLoading(status) {
      this.loading = status
    },
    
    // 登录
    async login(credentials) {
      try {
        this.setLoading(true)
        
        // 调用真实API
        const response = await userApi.login(credentials)
        
        // 更新状态
        this.userInfo = response.data.user
        this.isLoggedIn = true
        this.role = response.data.user.role
        
        // 保存到本地存储
        localStorage.setItem('userInfo', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('isLoggedIn', 'true')
        
        return true
      } catch (error) {
        console.error('登录失败', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },
    
    // 注册
    async register(userData) {
      try {
        this.setLoading(true)
        
        // 只发送后端需要的字段
      const registerData = {
        studentId: userData.studentId,
        name: userData.name,
        password: userData.password,
        gender: userData.gender,
        role: 'student' // 固定为学生角色
      }
        
        console.log('发送注册数据:', registerData)
        
        // 调用真实API
        const response = await userApi.register(registerData)
        
        return true
      } catch (error) {
        console.error('注册失败', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },
    
    // 退出登录
    logout() {
      // 清除状态
      this.userInfo = null
      this.isLoggedIn = false
      this.role = ''
      
      // 清除本地存储
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
    },
    
    // 加载本地存储的用户信息
    loadUserFromStorage() {
      try {
        const userInfoStr = localStorage.getItem('userInfo')
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        
        if (userInfoStr && isLoggedIn === 'true') {
          const userInfo = JSON.parse(userInfoStr)
          this.userInfo = userInfo
          this.isLoggedIn = true
          this.role = userInfo.role
        }
      } catch (error) {
        console.error('加载本地用户信息失败', error)
        this.logout()
      }
    },
    
    // 更新用户信息
    async updateUserInfo(updatedInfo) {
      try {
        this.setLoading(true)
        
        // 调用真实API
        const response = await userApi.updateUserInfo(updatedInfo)
        
        // 更新状态
        this.userInfo = response.data.user
        
        // 保存到本地存储
        localStorage.setItem('userInfo', JSON.stringify(response.data.user))
        
        return true
      } catch (error) {
        console.error('更新用户信息失败', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },
    
    // 获取学习统计数据
    async getLearningStatistics() {
      try {
        this.setLoading(true)
        
        // 调用真实API
        const response = await userApi.getLearningStats()
        
        // 更新学习统计数据
        this.learningStats = response.data
        
        return true
      } catch (error) {
        console.error('获取学习统计失败', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },
    
    // 获取当前用户信息
    async fetchCurrentUser() {
      try {
        this.setLoading(true)
        
        // 调用真实API
        const response = await userApi.getCurrentUser()
        
        // 更新用户信息
        this.setUserInfo(response.data)
        
        return true
      } catch (error) {
        console.error('获取用户信息失败', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },
    
    // 设置用户信息
    setUserInfo(info) {
      this.userInfo = info
      this.isLoggedIn = true
      this.role = info.role
    },
    
    // 修改密码
    async changePassword(passwordData) {
      try {
        this.setLoading(true)
        
        // 调用真实API
        await userApi.changePassword(passwordData)
        
        return true
      } catch (error) {
        console.error('修改密码失败', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },
    
    // 上传头像
    async uploadAvatar(file) {
      try {
        this.setLoading(true)
        
        // 调用真实API
        const response = await userApi.uploadAvatar(file)
        
        // 更新头像信息
        if (response.data.avatar) {
          this.userInfo.avatar = response.data.avatar
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        }
        
        return true
      } catch (error) {
        console.error('上传头像失败', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },
    
    // 重置状态
    resetState() {
      this.userInfo = null
      this.isLoggedIn = false
      this.role = ''
      this.learningStats = {
        completedCourses: 0,
        totalScore: 0,
        ranking: 0,
        consecutiveDays: 0
      }
    }
  }
})