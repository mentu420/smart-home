export default [
  {
    path: '/houseAddDevice',
    name: 'HouseAddDevice',
    component: () => import('@/pages/house/houseAddDevice.vue'),
    meta: { title: '添加设备' },
  },
  {
    path: '/houseNoticeList',
    name: 'HouseNoticeList',
    component: () => import('@/pages/house/houseNoticeList.vue'),
    meta: { title: '消息列表' },
  },
  {
    path: '/houseNoticeItem',
    name: 'HouseNoticeItem',
    component: () => import('@/pages/house/houseNoticeItem.vue'),
    meta: { title: '消息详情' },
  },
]
