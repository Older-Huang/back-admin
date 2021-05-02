import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const dynamicRoutes = {
  'categories': {
    path: '/categories',
    name: 'Categories',
    component: () => import("views/categories/Categories")
  },
  'goods': {
    path: '/goods',
    name: 'Goods',
    component: () => import("views/goods/Goods"),
    children: [{
      path: 'add',
      name: 'Add',
      component: () => import("views/goods/Add")
    }]
  },
  "orders": {
    path: '/orders',
    name: 'Orders',
    component: () => import("views/orders/Orders")
  },
  "params": {
    path: '/params',
    name: 'Params',
    component: () => import("views/params/Params")
  },
  "reports": {
    path: '/reports',
    name: 'Reports',
    component: () => import("views/reports/Reports")
  },
  "rights": {
    path: '/rights',
    name: 'Rights',
    component: () => import("views/rights/Rights")
  },
  "roles": {
    path: '/roles',
    name: 'Roles',
    component: () => import("views/roles/Roles")
  },
  "users": {
    path: '/users',
    name: 'Users',
    component: () => import("views/users/Users")
  }
}

router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    next();
  } else {
    if (sessionStorage.getItem('token')) {
      next();
    } else {
      next('/login');
    }
  }
});

export const authDynamicRouter = () => {
  let myRouter = router.options.routes;
  let menuList = JSON.parse(sessionStorage.getItem('menuList'));
  menuList.forEach(item => {
    item.children.forEach(cItem => {
      myRouter[2].children.push(dynamicRoutes[cItem.path]);
    })
  });

  router.addRoutes(myRouter);
}

export default router