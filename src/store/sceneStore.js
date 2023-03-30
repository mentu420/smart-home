import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getStorage, removeStorage, setStorage } from '@/utils/storage.js'

export default defineStore('sceneStore', () => {
  // 统一token处理
  const sceneCreateItem = ref({})

  const sceneGallery = ref([
    {
      id: 0,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMS4xNjgwMTYzNzE5NzM2.jpg',
    },
    {
      id: 1,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMi4xNjgwMTYzNzIwOTQ5.jpg',
    },
    {
      id: 2,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMy4xNjgwMTYzNzIxNjY4.jpg',
    },
    {
      id: 3,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNC4xNjgwMTYzNzIwMDg1.jpg',
    },
    {
      id: 4,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNS4xNjgwMTYzNzIwNDQ2.jpg',
    },
    {
      id: 5,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNi4xNjgwMTYzNzI1NjUy.jpg',
    },
    {
      id: 6,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNy4xNjgwMTYzNzIyMzY1.jpg',
    },
    {
      id: 7,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctOC4xNjgwMTYzNzI0MDQ3.jpg',
    },
    {
      id: 8,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctOS4xNjgwMTYzNzIzMTM5.jpg',
    },
    {
      id: 9,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTAuMTY4MDE2MzcyNzgzNw==.jpg',
    },
    {
      id: 10,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTEuMTY4MDE2MzczNTMxOQ==.jpg',
    },
    {
      id: 11,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTIuMTY4MDE2MzczNjkzOQ==.jpg',
    },
    {
      id: 12,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTMuMTY4MDE2MzczOTAxNA==.jpg',
    },
    {
      id: 13,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTQuMTY4MDE2Mzc0MTAzMw==.jpg',
    },
  ])

  const updateSceneCreateItem = (palyload) => {
    console.log('updateSceneCreateItem', palyload)
    sceneCreateItem.value = { ...sceneCreateItem.value, ...palyload }
  }

  const clearSceneCreateItem = () => (sceneCreateItem.value = {})

  return { sceneCreateItem, sceneGallery, updateSceneCreateItem, clearSceneCreateItem }
})
