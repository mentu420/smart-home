import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export default defineStore('deviceStore', () => {
  // 设备分类
  const deviceClassify = ref({
    lamp: ['1000', '10001'], //灯
    led: ['1000', '10001'], //灯带
    underfloorHeat: ['1020', '1021', '1022', '1023'], //地暖
    ariCooler: ['102001'], //空调
    freshAir: ['1040', '1041', '1042', '1043'], //新风
    curtain: ['101005'], //窗帘
    music: ['1080'], //音乐
  })

  return { deviceClassify }
})
