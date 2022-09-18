import http from "~/utils/axios"
import { queryParams } from "~/utils/common"

// http://dishaxy.dishait.cn/shopadminapi


export const GetGoodsList = (page, query = {}) => {
  let r = queryParams(query)
  return http.get(`/admin/goods/${page}${r}`)
}

export const UpdateGoodsStatus = (ids, status) => {
  return http.post(`/admin/goods/changestatus`, { ids, status })
}

export const CreateGoods = (data) => {
  return http.post(`/admin/goods`, data)
}

export const UpdateGoods = (id, data) => {
  return http.post(`/admin/goods/${id}`, data)
}

export const DeleteGoods = (ids) => {
  return http.post(`/admin/goods/delete_all`, { ids })
}

export const RestoreGoods = (ids) => {
  return http.post(`/admin/goods/restore`, { ids })
}

export const DestroyGoods = (ids) => {
  return http.post(`/admin/goods/destroy`, { ids })
}

export const ReadGoods = (id) => {
  return http.get(`/admin/goods/read/${id}`)
}

export const SetGoodsBanner = (id, data) => {
  return http.post(`/admin/goods/banners/${id}`, data)
}

export const UpdateGoodsSkus = (id, data) => {
  return http.post(`/admin/goods/updateskus/${id}`, data)
}

export const CreateGoodsSkusCard = (data) => {
  return http.post(`/admin/goods_skus_card`, data)
}

export const UpdateGoodsSkusCard = (id, data) => {
  return http.post(`/admin/goods_skus_card/${id}`, data)
}

export const DeleteGoodsSkusCard = (id) => {
  return http.post(`/admin/goods_skus_card/${id}/delete`)
}

export const SortGoodsSkusCard = (data) => {
  return http.post(`/admin/goods_skus_card/sort`, data)
}

export const CreateGoodsSkusCardValue = (data) => {
  return http.post(`/admin/goods_skus_card_value`, data)
}

export const UpdateGoodsSkusCardvalue = (id, data) => {
  return http.post(`/admin/goods_skus_card_value/${id}`, data)
}
export const DeleteGoodsSkusCardValue = (id) => {
  return http.post(`/admin/goods_skus_card_value/${id}/delete`)
}

export function ChooseAndGoodsSkusCard(id, data) {
  return http.post(`/admin/goods_skus_card/${id}/set`, data)
}