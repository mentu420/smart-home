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
      meta: { title: '登录' },
    },
    {
      path: '/accountLogin',
      name: 'AccountLogin',
      component: () => import('@/pages/login/accountLogin.vue'),
      meta: { title: '账号登录' },
    },
    {
      path: '/phoneLogin',
      name: 'PhoneLogin',
      component: () => import('@/pages/login/phoneLogin.vue'),
      meta: { title: '手机号登录' },
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: () => import('@/pages/login/forgetPassword.vue'),
      meta: { title: '忘记密码' },
    },
    {
      path: '/forgetVaildator',
      name: 'ForgetVaildator',
      component: () => import('@/pages/login/forgetVaildator.vue'),
      meta: { title: '设置密码' },
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
    {
      path: '/meAgreement',
      name: 'Agreement',
      component: () => import('@/pages/me/meAgreement.vue'),
      meta: { title: '软件许可与服务协议' },
    },
    {
      path: '/meAbout',
      name: 'MeAbout',
      component: () => import('@/pages/me/meAbout.vue'),
      meta: { title: '关于' },
    },
    {
      path: '/meConceal',
      name: 'MeConceal',
      component: () => import('@/pages/me/meConceal.vue'),
      meta: { title: '隐私' },
    },
    {
      path: '/meHouse',
      name: 'MeHouse',
      component: () => import('@/pages/me/meHouse.vue'),
      meta: { title: '家庭管理' },
    },
    {
      path: '/meHouseName',
      name: 'MeHouseName',
      component: () => import('@/pages/me/meHouseName.vue'),
      meta: { title: '家庭名称' },
    },
    {
      path: '/meHouseMap',
      name: 'MeHouseMap',
      component: () => import('@/pages/me/meHouseMap.vue'),
      meta: { title: '家庭位置' },
    },
    {
      path: '/meHouseMember',
      name: 'MeHouseMember',
      component: () => import('@/pages/me/meHouseMember.vue'),
      meta: { title: '成员与权限' },
    },
    {
      path: '/meRoomManage',
      name: 'MeRoomManage',
      component: () => import('@/pages/me/meRoomManage.vue'),
      meta: { title: '家庭管理' },
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
