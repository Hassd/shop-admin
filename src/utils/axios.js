import axios, { AxiosRequestConfig, HeadersDefaults } from "axios"
import { toast } from "../utils/common";
import { getToken } from "../utils/auth";
import store from "~/store";

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

//拦截request的发送请求和响应请求，并做一定的配置
request.interceptors.request.use(
  //拦截发送请求，并给请求头信息headers加上token令牌
  (config) => {
    let token = getToken()
    if (token) {
      config.headers["token"] = token;
    }
    console.log("request config", config);
    return config
  },
  err => {
    Promise.reject(err)
  }
)
request.interceptors.response.use(
  //拦截响应请求 ， 这里直接返回数据
  response => {
    console.log("response", response)
    return response.request.responseType == "blob" ? response.data : response.data.data;
  },
  err => {
    let msg = err.response.data.msg || "请求失败";

    if (msg == "非法token，请先登录！") {
      store.dispatch("logout").finally(() => {
        location.reload();
      })
    }
    toast(msg, 'error');
    Promise.reject(err)
  }
)
//导出request

class Http {
  constructor() { }

  get(url, params = {}) {
    return request(url, {
      method: "GET",
      params: params || undefined
    });
  }

  post(url, params = {}) {
    return request(url, {
      method: "POST",
      data: params || null,
      // data: qs.stringify(params)
    });
  }

  blob(url) {
    return request.post(url, {}, {
      responseType: "blob"
    });
  }

  delete(url, params) {
    return request(url, {
      method: "DELETE",
      data: params
    });
  }

  put(url, params) {
    return request(url, {
      method: "PUT",
      data: params
    });
  }

  upload(url, params) {
    return request(url, {
      method: "POST",
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

}

const http = new Http();
export default http;

