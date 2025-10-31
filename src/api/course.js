import request from '@/utils/request'

export const selectAll = (page, pageSize, name) => 
  request.get(`/courses/listAll`)

export const queryPageApi = (page, pageSize, name) => 
  request.get(`/courses/page?page=${page}&pageSize=${pageSize}&name=${encodeURIComponent(name || '')}`)
export const searchCoursesApi = (name) => 
  request.get(`/courses/search?name=${encodeURIComponent(name || '')}`);


export const addApi = (course) => request.post('/courses', course)

export const queryInfoApi = (id) => request.get(`/courses/${id}`)

export const updateApi = (course) => request.put(`/courses`, course)

export const deleteApi = (id) => request.delete(`/courses/${id}`)