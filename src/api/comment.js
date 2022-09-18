import http from "~/utils/axios"
import { queryParams } from "~/utils/common"
// http://dishaxy.dishait.cn/shopadminapi

export const GetGoodsCommentList = (page, query = {}) => {
  let r = queryParams(query)
  return http.get(`/admin/goods_comment/${page}${r}`)
}

export const UpdateGoodsCommentStatus = (id, status) => {
  return http.post(`/admin/goods_comment/${id}/update_status`, { status })
}

export const ReviewGoodsComment = (id, data) => {
  return http.post(`/admin/goods_comment/review/${id}`, { data })
}


