import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'

import { getStorage, setStorage, isObjectString } from '@/utils/storage.js'

import commonRouters from './modules/common.js'
import houseRouters from './modules/house.js'
import meRouters from './modules/me.js'
import smartRouters from './modules/smart.js'

const redirect = (to) => {
  const token = getStorage(import.meta.env.VITE_APP_STORAGE_TOKEN)
  if (token) {
    return '/tabNavigator/work'
  } else {
    return '/login'
  }
}

const Router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // window.scroll({ left: 0, top: savedPosition.top, behavior: "smooth" });
      return savedPosition
    } else {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      return { left: 0, top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/accountLogin',
    },
    {
      path: '/webview',
      name: 'Webview',
      component: () => import('@/pages/common/webviewPage.vue'),
    },
    {
      path: '/tabbar',
      name: 'Tabbar',
      component: () => import('@/pages/tabbar/tabbarPage.vue'),
      children: [
        {
          path: 'tabbarHouse',
          name: 'HousePage',
          component: () => import('@/pages/tabbar/housePage.vue'),
          meta: { title: '家' },
        },
        {
          path: 'tabbarSmart',
          name: 'SmartPage',
          component: () => import('@/pages/tabbar/smartPage.vue'),
          meta: { title: '智能' },
        },
        {
          path: 'tabbarMe',
          name: 'MePage',
          component: () => import('@/pages/tabbar/mePage.vue'),
          meta: { title: '我的' },
        },
      ],
    },
    ...meRouters,
    ...smartRouters,
    ...houseRouters,
    ...commonRouters,
  ],
})

NProgress.configure({ showSpinner: false })
Router.beforeEach(async (to, from, next) => {
  NProgress.start()

  next()
})

Router.afterEach((to, from) => {
  NProgress.done()
})

//清空路由历史
export const resetRouter = () => {
  const newRouter = createRouter({ history: createWebHashHistory(), routes: [] })
  Router.matcher = newRouter.matcher // the relevant part
}

export default Router
