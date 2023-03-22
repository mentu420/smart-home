<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import dayjs from 'dayjs'
import qs from 'qs'
import { onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import image1 from '@/assets/images/smart/smart-bg-1.jpg'
import { mapLoad, getCityInfoByIp } from '@/hooks/useAMap'

const router = useRouter()

const homeList = ref([
  { text: '选项一', index: 0 },
  { text: '选项二', index: 1 },
  { text: '选项三', index: 2 },
])
const configList = ref([
  { text: '选项一', index: 0 },
  { text: '选项二', index: 1 },
  { text: '选项三', index: 2 },
])
const tabList = ref([
  {
    text: '全屋',
    dragList: [
      { id: 0, text: '照明', list: [{}] },
      { id: 1, text: '场景', list: [{}] },
      { id: 2, text: '常用设备', list: [{}] },
    ],
  },
  {
    text: '客厅',
    dragList: [
      { id: 0, text: '照明', list: [] },
      { id: 1, text: '场景', list: [] },
      { id: 2, text: '常用设备', list: [] },
    ],
  },
])
const showHomeList = ref(false)
const homeAction = ref(0)
const showConfig = ref(false)
const tabActive = ref(0)
const drag = ref(false) // 是否可以拖拽

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

const onHomeSelect = (action) => {
  console.log(action)
  homeAction.value = action.index
}
const onConfigSelect = (action) => {
  console.log(action)
}

const setWeatherIcon = (type) => h(IconPark, { type, size: '2em', theme: 'outline' })

const weatherIconList = [
  { icon: setWeatherIcon('cloudy'), list: ['少云', '晴间多云', '多云', '阴'] }, //多云
  {
    icon: setWeatherIcon('fog'),
    list: ['霾', '中度霾', '重度霾', '严重霾', '雾', '浓雾', '强浓雾', '轻雾', '大雾', '特强浓雾'],
  }, //大雾
  { icon: setWeatherIcon('heavy-rain'), list: ['小雨', '中雨', '大雨'] }, //大雨
  {
    icon: setWeatherIcon('heavy-wind'),
    list: ['强风/劲风', '疾风', '大风', '烈风', '风暴', '狂爆风', '飓风', '热带风暴', '龙卷风'],
  }, //大风
  {
    icon: setWeatherIcon('light-rain'),
    list: ['阵雨', '毛毛雨/细雨', '雨', '小雨-中雨', '中雨-大雨'],
  }, //小雨
  { icon: setWeatherIcon('moon'), list: ['冷'] }, //月亮
  { icon: setWeatherIcon('sandstorm'), list: ['浮尘', '扬沙', '沙尘暴', '强沙尘暴', ''] }, //沙尘暴
  { icon: setWeatherIcon('snow'), list: ['雪', '阵雪', '大雪', '暴雪', '中雪-大雪', '大雪-暴雪'] }, //下雪
  {
    icon: setWeatherIcon('snowflake'),
    list: ['雨雪天气', '雨夹雪', '阵雨夹雪', '冻雨', '小雪', '中雪', '小雪-中雪', '冷'],
  }, //雪花
  { icon: setWeatherIcon('sun-one'), list: ['热'] }, //太阳
  { icon: setWeatherIcon('sunny'), list: ['晴'] }, //晴
  {
    icon: setWeatherIcon('thunderstorm'),
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
  { icon: setWeatherIcon('wind'), list: ['有风', '微风', '和风', '清风'] }, //刮风
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

const init = async () => {
  try {
    weatherInfo.value = await getWeatherInfo()
  } catch (error) {
    console.warn('加载天气出错', error)
  }
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <div class="flex justify-between p-4">
      <van-popover
        v-model:show="showHomeList"
        :actions="homeList"
        placement="bottom-start"
        @select="onHomeSelect"
      >
        <template #reference>
          <div class="flex items-center space-x-4">
            <h4>{{ homeList.find((homeItem, homeIndex) => homeIndex == homeAction).text }}</h4>
            <van-icon name="arrow-down" />
          </div>
        </template>
      </van-popover>
      <div class="space-x-4">
        <van-icon size="20" name="bell" />
        <van-icon size="20" name="plus" @click="router.push({ path: '/houseAddDevice' })" />
      </div>
    </div>
    <div ref="weatherRef" class="min-h-10 flex items-end p-4">
      <h2>{{ weatherInfo.temp }}</h2>
      <p class="ml-1 mr-6 text-sm">℃</p>
      <component :is="weatherInfo.icon" />
    </div>
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
        <div class="flex flex-auto items-center justify-end pr-2">
          <van-popover
            v-model:show="showConfig"
            :actions="configList"
            placement="bottom-end"
            @select="onConfigSelect"
          >
            <template #reference>
              <IconPark type="setting-config" theme="outline" />
            </template>
          </van-popover>
        </div>
      </template>
      <van-tab v-for="(tabItem, tabIndex) in tabList" :key="tabIndex" :title="tabItem.text">
        <transition-group>
          <draggable v-bind="dragOptions" key="dragggable" v-model="tabItem.dragList" item-key="id">
            <template #item="{ element }">
              <section class="p-4">
                <h4 class="mb-2 text-gray-600">{{ element.text }}</h4>
                <ul v-if="element.id == 0" class="grid grid-cols-2 gap-4">
                  <li
                    v-for="(lightItem, lightIndex) in 4"
                    :key="lightIndex"
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
                    v-for="(lightItem, lightIndex) in 4"
                    :key="lightIndex"
                    class="flex items-center rounded-lg bg-gray-300 p-3"
                  >
                    <div class="relative h-full w-full">
                      <div class="absolute top-0 right-0">
                        <IconPark type="more" />
                      </div>
                      <IconPark size="2em" type="tips" theme="filled" fill="#ff976a" />
                      <h4 class="space-x-2 text-white">
                        <label>一楼</label>
                        <label>客厅</label>
                      </h4>
                      <p class="mt-2 text-sm text-gray-400">2个灯亮</p>
                    </div>
                  </li>
                </ul>
              </section>
            </template>
          </draggable>
        </transition-group>
      </van-tab>
    </van-tabs>
  </div>
</template>
