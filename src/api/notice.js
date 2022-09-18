import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetNoticeList = (page) => {
  return http.get(`/admin/notice/${page}`, {})
}

export const CreateNotice = (data) => {
  return http.post(`/admin/notice`, data)
}

export const UpdateNotice = (id, data) => {
  return http.post(`/admin/notice/${id}`, data)
}

export const DeleteNotice = (id) => {
  return http.post(`/admin/notice/${id}/delete`)
}
