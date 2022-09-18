import { createStore } from 'vuex'
import { Login, GetInfo } from "~/api/manager";
import { removeToken, setToken } from "../utils/auth";

const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      // 侧边宽度
      asideWidth: "250px",

      menus: [],
      ruleNames: []
    }
  },
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user
    },
    // 展开/缩起侧边
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
    },
    SET_MENUS(state, menus) {
      state.menus = menus;
    },
    SET_RULENAME(state, ruleNames) {
      state.ruleNames = ruleNames;
    }

  },
  actions: {
    // 登录
    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        Login(data).then(res => {
          setToken(res.token);
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取当前登录用户信息
    getinfo({ commit }) {
      return new Promise((resolve, reject) => {
        GetInfo().then(res => {
          commit("SET_USERINFO", res)
          commit("SET_MENUS", res.menus)

          commit("SET_RULENAME", res.ruleNames)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    logout({ commit }) {
      //移除cookie里的token
      removeToken();

      //清除当前用户状态vuex
      commit("SET_USERINFO", {})
    }
  }
})

export default store;
