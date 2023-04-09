<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import { getHouseList } from '@/apis/houseApi.js'
import image1 from '@/assets/images/smart/smart-bg-1.jpg'
import { mapLoad, getCityInfoByIp } from '@/hooks/useAMap'
import deviceStore from '@/store/deviceStore.js'
import houseStore from '@/store/houseStore.js'
import sceneStore from '@/store/sceneStore'

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
const { deviceList, getDeviceTypeItem } = storeToRefs(deviceStore())
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
    const { initHouse, initRoomList } = houseStore()
    const { initDevice } = deviceStore()
    await Promise.all([initHouse(), initRoomList(), initDevice()])
    weatherInfo.value = await getWeatherInfo()
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
            <van-popover
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
            </van-popover>
          </div>
        </div>
        <div ref="weatherRef" class="min-h-10 flex items-end p-4">
          <h2>{{ weatherInfo.temp }}</h2>
          <p class="ml-1 mr-4 text-sm">℃</p>
          <h2 class="mr-2 text-lg">{{ weatherInfo.weather }}</h2>
          <IconPark :type="weatherInfo.icon" size="1.5em" />
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
            <transition-group>
              <draggable v-bind="dragOptions" key="dragggable" v-model="commonList" item-key="id">
                <template #item="{ element }">
                  <section class="p-2">
                    <div
                      class="p-2"
                      :class="{
                        'rounded-xl border border-dotted border-theme-color shadow':
                          !dragOptions.disabled,
                      }"
                    >
                      <h4 class="mb-2 text-gray-600">{{ element.text }}</h4>
                      <ul v-if="element.id == 1" class="grid grid-cols-2 gap-4">
                        <li
                          v-for="(lightItem, lightIndex) in 4"
                          :key="lightIndex"
                          :style="{ backgroundImage: 'url(' + image1 + ')' }"
                          class="flex items-center overflow-hidden rounded-lg bg-gray-300 bg-cover bg-center bg-no-repeat"
                        >
                          <div class="flex w-full items-center">
                            <h4
                              class="h-full w-full space-x-2 bg-black bg-opacity-50 px-3 py-6 text-white"
                            >
                              <label>一楼</label>
                              <label class="rounded bg-gray-200 px-2 py-1 text-xs">客厅</label>
                            </h4>
                          </div>
                        </li>
                      </ul>

                      <ul v-if="element.id == 2" class="grid grid-cols-2 gap-4">
                        <li
                          v-for="(deviceItem, deviceIndex) in deviceList"
                          :key="deviceIndex"
                          class="flex items-center rounded-lg bg-white p-3"
                        >
                          <div class="relative h-full w-full">
                            <div class="absolute top-0 right-0">
                              <IconPark
                                type="more"
                                @click="router.push({ path: '/smartDeviceStatus' })"
                              />
                            </div>
                            <IconPark size="1.5em" type="tips" theme="filled" fill="#ff976a" />
                            <p class="my-2">{{ deviceItem.mingcheng }}</p>
                            <p class="text-sm text-gray-400">开</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </section>
                </template>
              </draggable>
            </transition-group>
          </van-tab>
          <van-tab
            v-for="(tabItem, tabIndex) in roomList"
            :key="tabIndex"
            :title="tabItem.mingcheng"
          >
            <section class="p-4">
              <ul class="grid grid-cols-2 gap-4">
                <li
                  v-for="(sceneItem, sceneIndex) in 3"
                  :key="sceneIndex"
                  :style="{ backgroundImage: 'url(' + image1 + ')' }"
                  class="flex items-center overflow-hidden rounded-lg bg-gray-300 bg-cover bg-center bg-no-repeat"
                >
                  <div class="h-full w-full bg-black bg-opacity-50 p-3">
                    <h4 class="space-x-2 text-white">
                      <label>一楼</label>
                      <label>客厅</label>
                    </h4>
                    <p class="mt-2 text-sm text-gray-100">2个灯亮</p>
                  </div>
                </li>
              </ul>
              <div class="flex items-center py-4">
                <h4 class="text-gray-600">照明</h4>
                <label class="ml-2 text-xs text-gray-400">2个灯亮</label>
              </div>
              <ul class="mb-4 grid grid-cols-2 gap-4">
                <li
                  v-for="(btnItem, btnIndex) in ['全开', '全关']"
                  :key="btnIndex"
                  :style="{ backgroundImage: 'url(' + image1 + ')' }"
                  class="flex items-center overflow-hidden rounded-lg bg-gray-300 bg-cover bg-center bg-no-repeat"
                >
                  <div class="h-full w-full bg-black bg-opacity-50 px-3 py-6">
                    <h4 class="space-x-2 text-white">{{ btnItem }}</h4>
                  </div>
                </li>
              </ul>
              <ul class="grid grid-cols-2 gap-4">
                <li
                  v-for="(deviceItem, deviceIndex) in 4"
                  :key="deviceIndex"
                  class="flex items-center rounded-lg bg-gray-300 p-3"
                >
                  <div class="relative h-full w-full">
                    <div class="absolute top-0 right-0">
                      <IconPark type="more" @click="router.push({ path: '/smartDeviceStatus' })" />
                    </div>
                    <IconPark
                      size="2em"
                      :type="getDeviceTypeItem(deviceItem.xiaoleixing, 'subCategory').icon"
                      theme="filled"
                      fill="#ff976a"
                    />
                    <h4 class="space-x-2 text-white">
                      <label>一楼</label>
                      <label>客厅</label>
                    </h4>
                    <p class="mt-2 text-sm text-gray-400">2个灯亮</p>
                  </div>
                </li>
              </ul>
            </section>
          </van-tab>
        </van-tabs>
        <div class="absolute right-0 top-0 bg-gray-100">
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
