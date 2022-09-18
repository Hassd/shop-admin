import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetRuleList = () => {
  return http.get("/admin/rule/1")
}

export const CreateRule = (data) => {
  return http.post("/admin/rule", data)
}

export const UpdateRule = (id, data) => {
  return http.post(`/admin/rule/${id}`, data)
}

export const DeleteRule = (id) => {
  return http.post(`/admin/rule/${id}/delete`)
}
export const UpdateRuleStatus = (id, status) => {
  return http.post(`/admin/rule/${id}/update_status`, { status })
}
