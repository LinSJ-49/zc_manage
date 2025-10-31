import request from '@/utils/request'

export const queryPageApi = (page, pageSize, studentId, courseId) => 
  request.get(`/studentCourses?page=${page}&pageSize=${pageSize}&studentId=${studentId || ''}&courseId=${courseId || ''}`)

export const searchScoresApi = (studentId, courseId) => 
  request.get(`/studentCourses?studentId=${studentId || ''}&courseId=${courseId || ''}`)

export const addApi = (score) => request.post('/studentCourses', score)

export const queryInfoApi = (id) => request.get(`/studentCourses/${id}`)

export const updateApi = (score) => request.put(`/studentCourses`, score)

export const deleteApi = (id) => request.delete(`/studentCourses/${id}`)