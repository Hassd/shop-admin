import store from "~/store"

/*  v-permission指令按钮级权限控制
  
    1. 接受参数，判断是否为数组，不是数组报错
    2. 循环参数，和登录时获取的权限信息比对，看参数数组里的是否在权限数组里
    3. 在就通过，不在就销毁组件
*/
function hasPermission(value, el = false) {
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，列如 v-permission="['getStatistics3,GET']"`)
  }

  let hasAuth = value.findIndex(v => store.state.ruleNames.includes(v)) != -1;

  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el)
  }

  return hasAuth
}

export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        hasPermission(binding.value, el)
      },
    })
  }
}
