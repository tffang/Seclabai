import apiClient from './config'

// 学生管理相关API
export const studentApi = {
  // 获取学生列表
  getStudents: async (params) => {
    return await apiClient.get('/students', { params })
  },
  
  // 添加学生
  createStudent: async (studentData) => {
    return await apiClient.post('/students', studentData)
  },
  
  // 更新学生信息
  updateStudent: async (id, studentData) => {
    return await apiClient.put(`/students/${id}`, studentData)
  },
  
  // 删除学生
  deleteStudent: async (id) => {
    return await apiClient.delete(`/students/${id}`)
  },
  
  // 更新学生状态
  updateStudentStatus: async (id, status) => {
    return await apiClient.patch(`/students/${id}/status`, { status })
  },
  
  // 获取学生详情
  getStudentDetail: async (id) => {
    return await apiClient.get(`/students/${id}`)
  },
  
  // 获取班级列表
  getClasses: async () => {
    return await apiClient.get('/classes')
  }
}