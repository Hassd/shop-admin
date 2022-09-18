import http from "~/utils/axios"
import { queryParams } from "~/utils/common"

// http://dishaxy.dishait.cn/shopadminapi


export const GetOrderList = (page, query = {}) => {
  let r = queryParams(query)
  return http.get(`/admin/order/${page}${r}`)
}

export const DeleteOrder = (ids) => {
  return http.post(`/admin/order/delete_all`, { ids })
}

export const ExcelexportOrder = (query = {}) => {
  let r = queryParams(query)
  return http.blob(`/admin/order/excelexport${r}`)
}

export const GetShipInfo = (id) => {
  return http.get(`/admin/order/${id}/get_ship_info`)
}

export const RefundOrder = (id, data) => {
  return http.post(`/admin/order/${id}/handle_refund`, data)
}


