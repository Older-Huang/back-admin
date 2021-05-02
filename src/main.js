import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 重置样式
import 'assets/css/reset.css'
// elementUI
import ElementUI, { Tree } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 表格组件
import TreeTable from "vue-table-with-tree-grid"
Vue.component('tree-table', TreeTable);

// 动态路由菜单
import { authDynamicRouter } from "@/router"
authDynamicRouter();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
