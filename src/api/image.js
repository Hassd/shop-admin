import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetImageList = (id, page) => {
  return http.get(`/admin/image_class/${id}/image/${page}`, {})
}

export const DeleteImage = (ids) => {
  return http.post(`/admin/image/delete_all`, { ids })
}

export const UpdateImage = (id, name) => {
  return http.post(`/admin/image/${id}`, { name })
}

export const uploadImageAction = import.meta.env.VITE_APP_BASE_API + "/admin/image/upload";