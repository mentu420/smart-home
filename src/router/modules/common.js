export default [
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
    path: '/setPassword',
    name: 'SetPassword',
    component: () => import('@/pages/login/setPassword.vue'),
    meta: { title: '设置密码' },
  },
]
