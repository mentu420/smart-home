export default [
  {
    path: '/smartSceneCreate',
    name: 'SmartSceneCreate',
    component: () => import('@/pages/smart/smartSceneCreate.vue'),
    meta: { title: '创建场景', keepAlive: true },
  },
  {
    path: '/smartSceneGallery',
    name: 'SceneGallery',
    component: () => import('@/pages/smart/smartSceneGallery.vue'),
    meta: { title: '场景图库' },
  },
  {
    path: '/smartCondition',
    name: 'SmartCondition',
    component: () => import('@/pages/smart/smartCondition.vue'),
    meta: { title: '添加条件' },
  },
  {
    path: '/smartCondtionTime',
    name: 'SmartCondtionTime',
    component: () => import('@/pages/smart/smartCondtionTime.vue'),
    meta: { title: '添加条件' },
  },
  {
    path: '/smartTaskList',
    name: 'SmartTaskList',
    component: () => import('@/pages/smart/smartTaskList.vue'),
    meta: { title: '任务列表' },
  },
  {
    path: '/smartTaskDevices',
    name: 'SmartTaskDevices',
    component: () => import('@/pages/smart/smartTaskDevices.vue'),
    meta: { title: '设备分类' },
  },
  {
    path: '/smartTaskDeviceList',
    name: 'SmartTaskDeviceList',
    component: () => import('@/pages/smart/smartTaskDeviceList.vue'),
    meta: { title: '设备列表' },
  },
  {
    path: '/smartTaskDeviceConfig',
    name: 'SmartTaskDeviceConfig',
    component: () => import('@/pages/smart/smartTaskDeviceConfig.vue'),
    meta: { title: '设置设备' },
  },
  {
    path: '/smartDeviceStatus',
    name: 'SmartDeviceStatus',
    component: () => import('@/pages/smart/smartDeviceStatus.vue'),
    meta: { title: '设备状态' },
  },
  {
    path: '/smartDeviceInfo',
    name: 'SmartDeviceInfo',
    component: () => import('@/pages/smart/smartDeviceInfo.vue'),
    meta: { title: '设备信息' },
  },
]
