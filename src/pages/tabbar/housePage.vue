<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import { getHouseList } from '@/apis/houseApi.js'
import image1 from '@/assets/images/smart/smart-bg-1.jpg'
import DeviceCardItemVue from '@/components/base/DeviceCardItem.vue'
import ScenenCardItem from '@/components/base/ScenenCardItem.vue'
import { mapLoad, getCityInfoByIp } from '@/hooks/useAMap'
import { deviceStore, houseStore, sceneStore, userStore } from '@/store/'

const useDeviceStore = deviceStore()

const router = useRouter()
// 全屋常用设备
const commonList = ref([
  { id: 1, text: '常用场景', list: [{}] },
  { id: 2, text: '常用设备', list: [{}] },
])
const showHomeList = ref(false)
const loading = ref(false)
const showConfig = ref(false)
const tabActive = ref(0)
const { houseList, currentHouse, roomList } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(useDeviceStore)
const { getDeviceIcon } = useDeviceStore
const dragOptions = ref({
  animation: 200,
  group: 'description',
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})
const weatherInfo = ref({
  weather: '晴',
  temp: 26,
  icon: 'sun-one',
})
const weatherRef = ref(null)

const onHouseSelect = async (action) => {
  try {
    loading.value = true
    const id = action.bianhao
    console.log(action)
    // homeAction.value = action.index
    const { code } = await getHouseList({ op: 5, fangwubianhao: id })
    if (code != 0) return
    const { setCurrentHouse } = houseStore()
    setCurrentHouse(id)
    const { initRoomList } = houseStore()
    const { initDevice } = deviceStore()
    const { initScene } = sceneStore()
    await Promise.all([initRoomList(), initDevice(), initScene()])
  } finally {
    loading.value = false
  }
}

const onMoreSelect = () => {}

const onConfigSelect = (action) => {
  console.log(action)
  tabActive.value = roomList.value.findIndex((value) => value.id == action.id) + 1
}

const weatherIconList = [
  { icon: 'cloudy', list: ['少云', '晴间多云', '多云', '阴'] }, //多云
  {
    icon: 'fog',
    list: ['霾', '中度霾', '重度霾', '严重霾', '雾', '浓雾', '强浓雾', '轻雾', '大雾', '特强浓雾'],
  }, //大雾
  { icon: 'heavy-rain', list: ['小雨', '中雨', '大雨'] }, //大雨
  {
    icon: 'heavy-wind',
    list: ['强风/劲风', '疾风', '大风', '烈风', '风暴', '狂爆风', '飓风', '热带风暴', '龙卷风'],
  }, //大风
  {
    icon: 'light-rain',
    list: ['阵雨', '毛毛雨/细雨', '雨', '小雨-中雨', '中雨-大雨', '小到中雨'],
  }, //小雨
  { icon: 'moon', list: ['冷'] }, //月亮
  { icon: 'sandstorm', list: ['浮尘', '扬沙', '沙尘暴', '强沙尘暴', ''] }, //沙尘暴
  { icon: 'snow', list: ['雪', '阵雪', '大雪', '暴雪', '中雪-大雪', '大雪-暴雪'] }, //下雪
  {
    icon: 'snowflake',
    list: ['雨雪天气', '雨夹雪', '阵雨夹雪', '冻雨', '小雪', '中雪', '小雪-中雪', '冷'],
  }, //雪花
  { icon: 'sun-one', list: ['热'] }, //太阳
  { icon: 'sunny', list: ['晴'] }, //晴
  {
    icon: 'thunderstorm',
    list: [
      '雷阵雨',
      '雷阵雨并伴有冰雹',
      '暴雨',
      '大暴雨',
      '特大暴雨',
      '强阵雨',
      '强雷阵雨',
      '极端降雨',
      '大雨-暴雨',
      '暴雨-大暴雨',
      '大暴雨-特大暴雨',
    ],
  }, //雷雨
  { icon: 'wind', list: ['有风', '微风', '和风', '清风'] }, //刮风
]

const getWeatherInfo = async () => {
  const AMap = await mapLoad({ plugins: ['AMap.Weather', 'AMap.CitySearch'] })
  const cityInfo = await getCityInfoByIp(AMap)
  var weather = new AMap.Weather()
  return new Promise((resolve, reject) => {
    //执行实时天气信息查询
    weather.getForecast(cityInfo.city, function (err, data) {
      if (err) {
        reject(err)
        return
      }
      const hour = dayjs().hour()
      const isDay = hour >= 6 && hour <= 18 //是否白天
      const forecastItem = data.forecasts[0]
      const weather = forecastItem[isDay ? 'dayWeather' : 'nightWeather']
      const { icon } = weatherIconList.find((iconItem) => {
        return iconItem.list.some((item) => item == weather)
      }) || { icon: 'sun-one' }
      resolve({
        weather,
        icon,
        temp: forecastItem[isDay ? 'dayTemp' : 'nightTemp'],
      })
    })
  })
}

const toggleDrag = () => {
  dragOptions.value.disabled = !dragOptions.value.disabled
}

const init = async () => {
  try {
    const { useGetHouseListSync, useGetRoomListSync, setCurrentHouse } = houseStore()
    const { useGetDeviceListSync } = deviceStore()
    await Promise.all([
      useGetHouseListSync(true),
      useGetRoomListSync(true),
      useGetDeviceListSync(true),
    ])
    weatherInfo.value = await getWeatherInfo()
    console.log('currentHouse', currentHouse.value)
    if (currentHouse.value?.id) return
    console.log(houseList.value)
    setCurrentHouse(houseList.value[0].bianhao)
  } catch (err) {
    console.warn(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <van-pull-refresh v-model="loading" @refresh="init">
      <template v-if="dragOptions.disabled">
        <div class="flex justify-between p-4">
          <van-popover
            v-model:show="showHomeList"
            :actions="houseList"
            placement="bottom-start"
            @select="onHouseSelect"
          >
            <template #reference>
              <div class="flex items-center space-x-4">
                <h4>{{ currentHouse?.fangwumingcheng }}</h4>
                <van-icon name="arrow-down" />
              </div>
            </template>
          </van-popover>
          <div class="space-x-4">
            <van-icon size="20" name="bell" />
            <van-icon size="20" name="plus" @click="router.push({ path: '/houseAddDevice' })" />
            <!-- <van-popover
              :actions="[
                { text: '添加设备', value: 0 },
                { text: '拖拽排序', value: 1 },
              ]"
              placement="bottom-end"
              @select="onMoreSelect"
            >
              <template #reference>
                <van-icon size="20" name="plus" />
              </template>
            </van-popover> -->
          </div>
        </div>
        <div ref="weatherRef" class="min-h-10 flex items-end p-4">
          <h2>{{ weatherInfo.temp }}</h2>
          <p class="ml-1 mr-4 text-sm">℃</p>
          <h2 class="mr-2 text-lg">{{ weatherInfo.weather }}</h2>
        </div>
      </template>
      <div class="relative">
        <van-tabs
          v-model:active="tabActive"
          background="#f7f7f7"
          shrink
          sticky
          line-width="0"
          animated
          swipeable
        >
          <template #nav-right>
            <div class="w-10 flex-shrink-0"></div>
          </template>
          <van-tab title="全屋">
            <section class="p-4">
              <h4 class="mb-2 text-gray-600">常用场景</h4>
              <div class="grid grid-cols-2 gap-4">
                <ScenenCardItem v-for="(lightItem, lightIndex) in 2" :key="lightIndex">
                  <div class="space-x-2 text-white">
                    <label>{{ lightItem }}</label>
                    <label class="rounded bg-gray-200 px-2 py-1 text-xs text-black"> 客厅 </label>
                  </div>
                </ScenenCardItem>
              </div>
              <h4 class="my-2 text-gray-600">常用设备</h4>
              <ul class="grid grid-cols-2 gap-4">
                <DeviceCardItemVue
                  v-for="(deviceItem, deviceIndex) in deviceList"
                  :key="deviceIndex"
                  :label="deviceItem.mingcheng"
                  :icon="deviceItem.icon"
                  @click-right-icon="router.push({ path: '/smartDeviceStatus' })"
                ></DeviceCardItemVue>
              </ul>
            </section>
          </van-tab>
          <van-tab
            v-for="(tabItem, tabIndex) in roomList"
            :key="tabIndex"
            :title="tabItem.mingcheng"
          >
            <section class="p-4">
              <div class="grid grid-cols-2 gap-4">
                <ScenenCardItem v-for="(sceneItem, sceneIndex) in 2" :key="sceneIndex">
                  <label>{{ sceneItem }}</label>
                </ScenenCardItem>
              </div>
              <div class="flex items-center py-4">
                <h4 class="text-gray-600">照明</h4>
                <label class="ml-2 text-xs text-gray-400">2个灯亮</label>
              </div>
              <div class="mb-4 grid grid-cols-2 gap-4">
                <ScenenCardItem
                  v-for="(sceneItem, sceneIndex) in ['全开', '全关']"
                  :key="sceneIndex"
                >
                  <label>{{ sceneItem }}</label>
                </ScenenCardItem>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <DeviceCardItemVue
                  v-for="(deviceItem, deviceIndex) in deviceList"
                  :key="deviceIndex"
                  :label="deviceItem.mingcheng"
                  :icon="deviceItem.icon"
                  @click-right-icon="router.push({ path: '/smartDeviceStatus' })"
                ></DeviceCardItemVue>
              </div>
            </section>
          </van-tab>
        </van-tabs>
        <div class="absolute right-0 top-0 bg-page-gray">
          <div class="flex h-12 w-10 flex-auto items-center justify-center space-x-4 pr-2">
            <!-- <van-button v-if="!dragOptions.disabled" size="mini" type="primary" @click="toggleDrag">
                完成
              </van-button> -->
            <!-- <template v-else> -->
            <!-- <IconPark type="add-item" theme="outline" size="20" @click="toggleDrag" /> -->
            <van-popover
              v-model:show="showConfig"
              :actions="roomList"
              placement="bottom-end"
              @select="onConfigSelect"
            >
              <template #reference>
                <IconPark type="setting-config" theme="outline" size="20" />
              </template>
            </van-popover>
            <!-- </template> -->
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
