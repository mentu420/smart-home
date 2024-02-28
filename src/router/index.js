import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'

import userStore from '@/store/userStore.js'
import { getStorage, setStorage, isObjectString } from '@/utils/storage.js'

import commonRouters from './modules/common.js'
import houseRouters from './modules/house.js'
import meRouters from './modules/me.js'
import smartRouters from './modules/smart.js'

const redirect = (to) => {
  const token = getStorage(import.meta.env.VITE_APP_STORAGE_TOKEN)
  if (token) {
    return '/tabbar/tabbar-house'
  } else {
    return '/account-login'
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
      redirect,
    },
    {
      path: '/webview',
      name: 'Webview',
      component: () => import('@/pages/common/webview-page.vue'),
    },
    {
      path: '/launch-page',
      name: 'LaunchPage',
      component: () => import('@/pages/tabbar/launch-page.vue'),
      meta: {
        title: '启动页',
      },
    },
    {
      path: '/tabbar',
      name: 'TabbarPage',
      component: () => import('@/pages/tabbar/tabbar-page.vue'),
      children: [
        {
          path: 'tabbar-house',
          name: 'HousePage',
          component: () => import('@/pages/tabbar/house-page.vue'),
          meta: { title: '家', keepAlive: true },
        },
        {
          path: 'tabbar-smart',
          name: 'SmartPage',
          component: () => import('@/pages/tabbar/smart-page.vue'),
          meta: { title: '智能' },
        },
        {
          path: 'tabbar-me',
          name: 'MePage',
          component: () => import('@/pages/tabbar/me-page.vue'),
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

Router.goBack = function (delta = -1) {
  this.isBack = true //判断是否是返回操作
  window.history.go(delta)
}

export default Router
