export default [
  {
    path: '/house-ddd-device',
    name: 'HouseAddDevice',
    component: () => import('@/pages/house/house-add-device.vue'),
    meta: { title: '添加设备' },
  },
  {
    path: '/house-noticeList',
    name: 'HouseNoticeList',
    component: () => import('@/pages/house/house-notice-list.vue'),
    meta: { title: '消息列表' },
  },
  {
    path: '/house-notice-item',
    name: 'HouseNoticeItem',
    component: () => import('@/pages/house/house-notice-item.vue'),
    meta: { title: '消息详情' },
  },
]
