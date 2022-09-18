import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetUserLevelList = (page) => {
  return http.get(`/admin/user_level/${page}`, {})
}

export const CreateUserLevel = (data) => {
  return http.post(`/admin/user_level`, data)
}

export const UpdateUserLevel = (id, data) => {
  return http.post(`/admin/user_level/${id}`, data)
}

export const DeleteUserLevel = (id) => {
  return http.post(`/admin/user_level/${id}/delete`)
}

export const UpdateUserLevelStatus = (id, status) => {
  return http.post(`/admin/user_level/${id}/update_status`, { status })
}

