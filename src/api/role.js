import http from "~/utils/axios"

// http://dishaxy.dishait.cn/shopadminapi

export const GetRoleList = (page) => {
  return http.get(`/admin/role/${page}`, {})
}

export const CreateRole = (data) => {
  return http.post(`/admin/role`, data)
}

export const UpdateRole = (id, data) => {
  return http.post(`/admin/role/${id}`, data)
}

export const DeleteRole = (id) => {
  return http.post(`/admin/role/${id}/delete`)
}

export const UpdateRoleStatus = (id, status) => {
  return http.post(`/admin/role/${id}/update_status`, { status })
}

export const SetRoleRules = (id, rule_ids) => {
  return http.post(`/admin/role/set_rules`, { id, rule_ids })
}
