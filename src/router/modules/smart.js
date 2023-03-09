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
]
