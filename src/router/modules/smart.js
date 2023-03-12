export default [
  {
    path: '/sceneCreate',
    name: 'SceneCreate',
    component: () => import('@/pages/smart/sceneCreate.vue'),
    meta: { title: '创建场景' },
  },
  {
    path: '/sceneGallery',
    name: 'SceneGallery',
    component: () => import('@/pages/smart/sceneGallery.vue'),
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
    meta: { title: '设备列表' },
  },
  {
    path: '/smartTaskDeviceList',
    name: 'SmartTaskDeviceList',
    component: () => import('@/pages/smart/smartTaskDeviceList.vue'),
    meta: { title: '设备列表' },
  },
]
