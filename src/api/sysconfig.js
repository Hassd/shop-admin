import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetSysconfig = () => {
  return http.get(`/admin/sysconfig`, {})
}

export const SetSysconfig = (data) => {
  return http.post(`/admin/sysconfig`, data)
}

export const uploadAction = import.meta.env.VITE_APP_BASE_API + "/admin/sysconfig/upload"