import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetCouponList = (page) => {
  return http.get(`/admin/coupon/${page}`, {})
}

export const CreateCoupon = (data) => {
  return http.post(`/admin/coupon`, data)
}

export const UpdateCoupon = (id, data) => {
  return http.post(`/admin/coupon/${id}`, data)
}

export const DeleteCoupon = (id) => {
  return http.post(`/admin/coupon/${id}/delete`)
}

export const UpdateCouponStatus = (id) => {
  return http.post(`/admin/coupon/${id}/update_status`, { status: 0 })
}