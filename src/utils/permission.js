import { router, addRoutes } from "~/router";
import store from "~/store";
import { getToken } from "./auth"
import { toast, showFullLoading, hideFullLoading } from "./common"

// 判断是否加载过动态路由
let hasGetInfo = false

// 全局前置守卫
router.beforeEach(async (to, from, next) => {

  // 显示loading
  showFullLoading();

  let token = getToken();

  // 没有登录强制跳转到登录页
  if (!token && to.path !== "/login") {
    toast("请先登录！", "error")
    return next({
      path: "/login"
    })
  }

  // 防止重复登录
  if (token && to.path == "/login") {
    toast("请勿重复登录！", "error")
    return next({
      path: from.path ? from.path : "/"
    })
  }

  // 如果用户登录了，自动获取用户信息，并储存在vuex中
  let hasNewRoutes = false;
  if (token && !hasGetInfo) {
    let { menus } = await store.dispatch("getinfo")

    // 动态添加路由
    hasNewRoutes = addRoutes(menus)

    hasGetInfo = true;
  }

  // 设置页面标题
  let title = (to.meta.title ? to.meta.title + "-" : "") + " 购物商场后台 ";
  document.title = title;

  hasNewRoutes ? next(to.fullPath) : next();

})

// 全局后置守卫
router.afterEach((to) => {
  // 隐藏loading
  hideFullLoading();
})