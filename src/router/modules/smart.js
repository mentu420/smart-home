export default [
  {
    path: '/smart-scene-create',
    name: 'SmartSceneCreate',
    component: () => import('@/pages/smart/smart-scene-create.vue'),
    meta: { title: '创建场景', keepAlive: true },
  },
  {
    path: '/smart-scene-gallery',
    name: 'SceneGallery',
    component: () => import('@/pages/smart/smart-scene-gallery.vue'),
    meta: { title: '场景图库' },
  },
  {
    path: '/smart-condition',
    name: 'SmartCondition',
    component: () => import('@/pages/smart/smart-condition.vue'),
    meta: { title: '添加条件' },
  },
  {
    path: '/smart-condtion-time',
    name: 'SmartCondtionTime',
    component: () => import('@/pages/smart/smart-condtion-time.vue'),
    meta: { title: '添加条件' },
  },
  {
    path: '/smart-task-list',
    name: 'SmartTaskList',
    component: () => import('@/pages/smart/smart-task-list.vue'),
    meta: { title: '任务列表' },
  },
  {
    path: '/smart-task-device-classify',
    name: 'SmartTaskDevices',
    component: () => import('@/pages/smart/smart-task-device-classify.vue'),
    meta: { title: '设备分类' },
  },
  {
    path: '/smart-task-device-list',
    name: 'SmartTaskDeviceList',
    component: () => import('@/pages/smart/smart-task-device-list.vue'),
    meta: { title: '设备列表' },
  },
  {
    path: '/smart-task-device-config',
    name: 'SmartTaskDeviceConfig',
    component: () => import('@/pages/smart/smart-task-device-config.vue'),
    meta: { title: '设置设备' },
  },
  {
    path: '/smart-device-status',
    name: 'SmartDeviceStatus',
    component: () => import('@/pages/smart/smart-device-status.vue'),
    meta: { title: '设备状态' },
  },
  {
    path: '/smart-device-info',
    name: 'SmartDeviceInfo',
    component: () => import('@/pages/smart/smart-device-info.vue'),
    meta: { title: '设备信息' },
  },
]
