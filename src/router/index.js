import { createRouter, createWebHashHistory } from 'vue-router'

import LayoutsAdmin from "../layouts/admin.vue"
import Login from "../page/login.vue"
import NotFound from "../page/404.vue"
import Index from "../page/index.vue"
import GoodsList from "../page/goods/list.vue"
import CategoryList from "../page/category/list.vue"
import UserList from "../page/user/list.vue"
import OrderList from "../page/order/list.vue"
import CommentList from "../page/comment/list.vue"
import ImageList from "../page/image/list.vue"
import NoticeList from "../page/notice/list.vue"
import SettingBase from "../page/setting/base.vue"
import CouponList from "../page/coupon/list.vue"
import ManagerList from "../page/manager/list.vue"
import AccessList from "../page/access/list.vue"
import RoleList from "../page/role/list.vue"
import SkusList from "../page/skus/list.vue"
import LevelList from "../page/level/list.vue"
import SettingBuy from "../page/setting/buy.vue"
import SettingShip from "../page/setting/ship.vue"
import DistributionIndex from "../page/distribution/index.vue"
import DistributionSetting from "../page/distribution/setting.vue"

// 默认路由，全部用户都使用
const routes = [
  {
    path: '/',
    name: "admin",
    component: LayoutsAdmin,
  }, {
    path: "/login",
    name: "login",
    meta: {
      title: "登录页"
    },
    component: Login
  }, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      title: "错误页面"
    },
    component: NotFound
  }
]

// 动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
  {
    path: '/',
    name: "/",
    meta: {
      title: "后台首页"
    },
    component: Index
  },
  {
    path: '/goods/list',
    name: "/goods/list",
    meta: {
      title: "商品管理"
    },
    component: GoodsList,
  },
  {
    path: '/category/list',
    name: "/category/list",
    meta: {
      title: "分类列表"
    },
    component: CategoryList,
  },
  {
    path: '/user/list',
    name: "/user/list",
    meta: {
      title: "用户列表"
    },
    component: UserList,
  },
  {
    path: '/order/list',
    name: "/order/list",
    meta: {
      title: "订单列表"
    },
    component: OrderList,
  },
  {
    path: '/comment/list',
    name: "/comment/list",
    meta: {
      title: "评价列表"
    },
    component: CommentList,
  },
  {
    path: '/image/list',
    name: "/image/list",
    meta: {
      title: "图库列表"
    },
    component: ImageList,
  },
  {
    path: '/notice/list',
    name: "/notice/list",
    meta: {
      title: "公告列表"
    },
    component: NoticeList,
  },
  {
    path: '/setting/base',
    name: "/setting/base",
    meta: {
      title: "设置"
    },
    component: SettingBase,
  },
  {
    path: '/coupon/list',
    name: "/coupon/list",
    meta: {
      title: "优惠券列表"
    },
    component: CouponList,
  },
  {
    path: '/manager/list',
    name: "/manager/list",
    meta: {
      title: "管理员管理"
    },
    component: ManagerList,
  },
  {
    path: '/access/list',
    name: "/access/list",
    meta: {
      title: "菜单权限管理"
    },
    component: AccessList,
  },
  {
    path: '/role/list',
    name: "/role/list",
    meta: {
      title: "角色管理"
    },
    component: RoleList,
  },
  {
    path: '/skus/list',
    name: "/skus/list",
    meta: {
      title: "规格管理"
    },
    component: SkusList,
  },
  {
    path: '/level/list',
    name: "/level/list",
    meta: {
      title: "会员等级管理"
    },
    component: LevelList,
  },
  {
    path: '/setting/buy',
    name: "/setting/buy",
    meta: {
      title: "支付设置"
    },
    component: SettingBuy,
  },
  {
    path: '/setting/ship',
    name: "/setting/ship",
    meta: {
      title: "物流配置"
    },
    component: SettingShip,
  },
  {
    path: '/distribution/index',
    name: "/distribution/index",
    meta: {
      title: "分销员管理"
    },
    component: DistributionIndex,
  },
  {
    path: '/distribution/setting',
    name: "/distribution/setting",
    meta: {
      title: "分销员设置"
    },
    component: DistributionSetting,
  }
]


export const router = createRouter({
  // createWebHashHistory hash 路由
  // createWebHistory history 路由
  // createMemoryHistory 带缓存 history 路由
  history: createWebHashHistory(),
  routes
})

// 动态添加路由的方法
export function addRoutes(menus) {


  // 是否有新的路由
  let hasNewRoutes = false;

  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((e, index) => {
      let item = asyncRoutes.find(o => o.path == e.frontpath)

      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item)
        hasNewRoutes = true;
      }

      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child)
      }
    });
  }
  findAndAddRoutesByMenus(menus);

  console.log(router.getRoutes())
  return hasNewRoutes;
}