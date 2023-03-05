import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'

import { getStorage, setStorage, isObjectString } from '@/utils/storage.js'

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
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/login/loginPage.vue'),
    },
    {
      path: '/accountLogin',
      name: 'AccountLogin',
      component: () => import('@/pages/login/accountLogin.vue'),
    },
    {
      path: '/phoneLogin',
      name: 'PhoneLogin',
      component: () => import('@/pages/login/phoneLogin.vue'),
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: () => import('@/pages/login/forgetPassword.vue'),
    },
    {
      path: '/forgetVaildator',
      name: 'ForgetVaildator',
      component: () => import('@/pages/login/forgetVaildator.vue'),
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
          path: 'tabbarHome',
          name: 'HomePage',
          component: () => import('@/pages/tabbar/homePage.vue'),
        },
        {
          path: 'tabbarSmart',
          name: 'SmartPage',
          component: () => import('@/pages/tabbar/smartPage.vue'),
        },
        {
          path: 'tabbarMe',
          name: 'mePage',
          component: () => import('@/pages/tabbar/mePage.vue'),
        },
      ],
    },
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

export default Router
