import http from "~/utils/axios"
import { queryParams } from "~/utils/common"
// http://dishaxy.dishait.cn/shopadminapi

export const Login = (data) => {
  return http.post("/admin/login", data)
}

export const Logout = () => {
  return http.post("/admin/logout")
}

export const GetInfo = () => {
  return http.post("/admin/getinfo")
}

export const UpdatePassword = (data) => {
  return http.post("/admin/updatepassword", data)
}

export const GetManagerList = (page, query = {}) => {
  let r = queryParams(query)
  return http.get(`/admin/manager/${page}${r}`)
}

export const UpdateManagerStatus = (id, status) => {
  return http.post(`/admin/manager/${id}/update_status`, { status })
}


export const CreateManager = (data) => {
  return http.post(`/admin/manager`, data)
}

export const UpdateManager = (id, data) => {
  return http.post(`/admin/manager/${id}`, data)
}

export const DeleteManager = (id) => {
  return http.post(`/admin/manager/${id}/delete`)
}
