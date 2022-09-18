import http from "~/utils/axios"

// // http://dishaxy.dishait.cn/shopadminapi

export const GetImageClassList = (page) => {
  return http.get("/admin/image_class/" + page, {})
}

export const CreateImageClass = (data) => {
  return http.post("/admin/image_class", data)
}

export const UpdateImageClass = (id, data) => {
  return http.post("/admin/image_class/" + id, data)
}

export const DeleteImageClass = (id) => {
  return http.post("/admin/image_class/" + id + "/delete", {})
}
