import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetSkusList = (page) => {
  return http.get(`/admin/skus/${page}`, {})
}

export const CreateSkus = (data) => {
  return http.post(`/admin/skus`, data)
}

export const UpdateSkus = (id, data) => {
  return http.post(`/admin/skus/${id}`, data)
}

export const DeleteSkus = (ids) => {

  ids = !Array.isArray(ids) ? [ids] : ids;

  return http.post(`/admin/skus/delete_all`, { ids })
}

export const UpdateSkusStatus = (id, status) => {
  return http.post(`/admin/skus/${id}/update_status`, { status })
}

