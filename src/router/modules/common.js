export default [
  {
    path: '/account-login',
    name: 'AccountLogin',
    component: () => import('@/pages/login/account-login.vue'),
    meta: { title: '账号登录' },
  },
  {
    path: '/phone-login',
    name: 'PhoneLogin',
    component: () => import('@/pages/login/phone-login.vue'),
    meta: { title: '手机号登录' },
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: () => import('@/pages/login/forget-password.vue'),
    meta: { title: '忘记密码', keepAlive: true },
  },
  {
    path: '/forget-vaildator',
    name: 'ForgetVaildator',
    component: () => import('@/pages/login/forget-vaildator.vue'),
    meta: { title: '设置密码' },
  },
  {
    path: '/set-password',
    name: 'SetPassword',
    component: () => import('@/pages/login/set-password.vue'),
    meta: { title: '设置密码' },
  },
]
