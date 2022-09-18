import http from "~/utils/axios"

// // http://dishaxy.dishait.cn/shopadminapi

export const Statistics1 = () => {
  return http.get("/admin/statistics1", {})
}
export const Statistics2 = () => {
  return http.get("/admin/statistics2", {})
}
export const Statistics3 = (type = "hour") => {
  return http.get("/admin/statistics3?type=" + type, {})
}