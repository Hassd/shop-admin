import { useCookies } from "@vueuse/integrations/useCookies";
import { ref } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

export function useTabList() {
  let route = useRoute();
  let router = useRouter();
  const cookies = useCookies();

  const activeTab = ref(route.path);
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);

  // 初始化标签
  function initTabList() {
    let tbs = cookies.get("tabList");
    if (tbs) {
      tabList.value = tbs;
    }
  }
  initTabList();

  // 页面路由更新触发器
  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });

  // 添加标签导航
  const addTab = (tab) => {
    let noTab = tabList.value.findIndex((t) => t.path == tab.path) == -1;

    if (noTab) {
      tabList.value.push(tab);
    }
    cookies.set("tabList", tabList.value);
  };

  // 移除标签导航
  const removeTab = (t) => {
    let a = activeTab.value;
    let tabs = tabList.value;

    if (t == a) {
      tabs.forEach((tab, index) => {
        if (tab.path == t) {
          const nextTab = tabs[index + 1] || tabs[index - 1];

          if (nextTab) {
            a = nextTab.path;
          }
        }
      });
    }

    activeTab.value = a;
    tabList.value = tabList.value.filter((tab) => tab.path != t);

    cookies.set("tabList", tabList.value);
  };

  // 标签增加路由就跳转
  const changeTab = (t) => {
    activeTab.value = t;
    router.push(t);
  };

  // 关闭下拉菜单触发事件
  const handleClose = (c) => {
    if (c == "clearAll") {
      // 切换会首页
      activeTab.value = "/";

      // 过滤只剩下首页
      tabList.value = [
        {
          title: "后台首页",
          path: "/",
        },
      ];
    } else {
      // 过滤只剩下首页和当前激活的
      tabList.value = tabList.value.filter(
        (tab) => tab.path == "/" || tab.path == activeTab.value
      );
    }
    cookies.set("tabList", tabList.value);
  };
  return {
    activeTab,
    tabList,
    changeTab,
    handleClose,
    removeTab
  }
}