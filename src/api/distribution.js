import http from "~/utils/axios"
import { queryParams } from "~/utils/common"

// http://dishaxy.dishait.cn/shopadminapi

export const GetAgentStatistics = () => {
  return http.get(`/admin/agent/statistics`, {})
}

export const GetAgentList = (page, query = {}) => {
  let r = queryParams(query)
  return http.get(`/admin/agent/${page}${r}`)
}

export const GetAgentOrderList = (page, query = {}) => {
  let r = queryParams(query)
  return http.get(`/admin/user_bill/${page}${r}`)
}


export const Getconfig = () => {
  return http.get(`/admin/distribution_setting/get`, {})
}

export const Setconfig = (data) => {
  return http.post(`/admin/distribution_setting/set`, data)
}



