export default [
  {
    path: '/smart-scene-create',
    name: 'SmartSceneCreate',
    component: () => import('@/pages/smart/smartSceneCreate.vue'),
    meta: { title: '创建场景', keepAlive: true },
  },
  {
    path: '/smart-scene-gallery',
    name: 'SceneGallery',
    component: () => import('@/pages/smart/smartSceneGallery.vue'),
    meta: { title: '场景图库' },
  },
  {
    path: '/smart-condition',
    name: 'SmartCondition',
    component: () => import('@/pages/smart/smartCondition.vue'),
    meta: { title: '添加条件' },
  },
  {
    path: '/smart-condtion-time',
    name: 'SmartCondtionTime',
    component: () => import('@/pages/smart/smartCondtionTime.vue'),
    meta: { title: '添加条件' },
  },
  {
    path: '/smart-task-list',
    name: 'SmartTaskList',
    component: () => import('@/pages/smart/smartTaskList.vue'),
    meta: { title: '任务列表' },
  },
  {
    path: '/smart-task-device-classify',
    name: 'SmartTaskDevices',
    component: () => import('@/pages/smart/smartTaskDeviceClassify.vue'),
    meta: { title: '设备分类' },
  },
  {
    path: '/smart-task-deviceList',
    name: 'SmartTaskDeviceList',
    component: () => import('@/pages/smart/smartTaskDeviceList.vue'),
    meta: { title: '设备列表' },
  },
  {
    path: '/smart-task-device-config',
    name: 'SmartTaskDeviceConfig',
    component: () => import('@/pages/smart/smartTaskDeviceConfig.vue'),
    meta: { title: '设置设备' },
  },
  {
    path: '/smart-device-status',
    name: 'SmartDeviceStatus',
    component: () => import('@/pages/smart/smartDeviceStatus.vue'),
    meta: { title: '设备状态' },
  },
  {
    path: '/smart-deviceInfo',
    name: 'SmartDeviceInfo',
    component: () => import('@/pages/smart/smartDeviceInfo.vue'),
    meta: { title: '设备信息' },
  },
]
