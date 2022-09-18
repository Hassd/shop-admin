import http from "~/utils/axios"
import { queryParams } from "~/utils/common"
// http://dishaxy.dishait.cn/shopadminapi


export const GetUserList = (page, query = {}) => {
  let r = queryParams(query)
  return http.get(`/admin/user/${page}${r}`)
}

export const UpdateUserStatus = (id, status) => {
  return http.post(`/admin/user/${id}/update_status`, { status })
}


export const CreateUser = (data) => {
  return http.post(`/admin/user`, data)
}

export const UpdateUser = (id, data) => {
  return http.post(`/admin/user/${id}`, data)
}

export const DeleteUser = (id) => {
  return http.post(`/admin/user/${id}/delete`)
}
