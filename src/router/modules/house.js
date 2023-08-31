export default [
  {
    path: '/house-ddd-device',
    name: 'HouseAddDevice',
    component: () => import('@/pages/house/houseAddDevice.vue'),
    meta: { title: '添加设备' },
  },
  {
    path: '/house-noticeList',
    name: 'HouseNoticeList',
    component: () => import('@/pages/house/houseNoticeList.vue'),
    meta: { title: '消息列表' },
  },
  {
    path: '/house-notice-item',
    name: 'HouseNoticeItem',
    component: () => import('@/pages/house/houseNoticeItem.vue'),
    meta: { title: '消息详情' },
  },
]
