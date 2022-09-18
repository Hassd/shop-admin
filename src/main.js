import { createApp } from 'vue'
import App from './App.vue'

import 'element-plus/dist/index.css'

import { router } from './router'
import store from './store'

import "./utils/permission"

import 'virtual:windi.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import "nprogress/nprogress.css";

app.use(router)
app.use(store)

import permission from './directives/permission'
app.use(permission)

app.mount('#app')
