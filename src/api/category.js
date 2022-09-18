import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetCategoryList = () => {
  return http.get(`/admin/category`, {})
}

export const CreateCategory = (data) => {
  return http.post(`/admin/category`, data)
}

export const UpdateCategory = (id, data) => {
  return http.post(`/admin/category/${id}`, data)
}

export const DeleteCategory = (id) => {
  return http.post(`/admin/category/${id}/delete`)
}

export const UpdateCategoryStatus = (id) => {
  return http.post(`/admin/category/${id}/update_status`, { status: 0 })
}

export const GetCategoryGoods = (id) => {
  return http.get(`/admin/app_category_item/list?category_id=${id}`, {})
}

export const DeleteCategoryGoods = (id) => {
  return http.post(`/admin/app_category_item/${id}/delete`)
}

export const ConnectCategoryGoods = (data) => {
  return http.post(`/admin/app_category_item`, data)
}

