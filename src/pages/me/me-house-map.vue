<script setup>
import { showToast } from 'vant'
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { mapLoad, getCityInfoByIp } from '@/hooks/useAMap'
import { loadScript } from '@/utils/common.js'

defineOptions({ name: 'MeHouseMap' })

const route = useRoute()
const loading = ref(false)
const lnglat = ref(null)
const formattedAddress = ref('')
const search = ref('')
const searchList = ref([])
const map = ref(null)
const AMap = ref(null)

const setAdress = ([lng, lat]) => {
  lnglat.value = { lng, lat }
  var geocoder = new AMap.value.Geocoder()
  geocoder.getAddress([lng, lat], function (status, result) {
    if (status === 'complete' && result.regeocode) {
      formattedAddress.value = result.regeocode.formattedAddress
    } else {
      showToast('根据经纬度查询地址失败')
    }
  })
}

const onMapDragend = (e) => {
  const { lnglat } = e
  setAdress([lnglat.lng, lnglat.lat])
}

const addMarker = (position = [116.406315, 39.908775]) => {
  map.value.clearMap() // 清除地图覆盖物
  const marker = new AMap.value.Marker({
    position,
    title: '北京',
    draggable: true,
    cursor: 'move',
  })
  marker.setMap(map.value)
  marker.on('dragend', onMapDragend)
}

const onMapClick = (e) => {
  const { lnglat } = e
  const position = [lnglat.lng, lnglat.lat]
  addMarker(position)
  setAdress(position)
}

const onMapSearch = async () => {
  var currentCenter = map.value.getCenter()

  var placeSearch = new AMap.value.PlaceSearch({
    map: map.value,
  }) //构造地点查询类

  placeSearch.searchNearBy(
    search.value,
    [currentCenter.lng, currentCenter.lat],
    9999,
    function (status, result) {
      if (status === 'complete') {
        searchList.value = result.poiList?.pois
      }
    }
  )
}

const selectSearchItem = (item) => {
  const { location } = item
  const point = [location.lng, location.lat]
  lnglat.value = { lng: location.lng, lat: location.lat }
  addMarker(point)
  setAdress(point)
  map.value.panTo(point)
  searchList.value = []
}

const initMap = async (el = 'container', center = [116.404, 39.915]) => {
  AMap.value = await mapLoad({
    plugins: [
      'AMap.Weather',
      'AMap.CitySearch',
      'AMap.PlaceSearch',
      'AMap.AutoComplete',
      'AMap.Geocoder',
    ],
  })
  map.value = new AMap.value.Map(el, {
    zoom: 13,
    center,
    resizeEnable: true,
  })
  map.value.on('click', onMapClick)
  addMarker(center)
  setAdress(center)
}

const onAgainLoaction = () => {}
const onSearch = () => {
  onMapSearch()
}
const onMapConfirm = () => {}

onMounted(async () => {
  const { longitude = 116.404, latitude = 39.915, city = '北京' } = route.query
  initMap()
})

onUnmounted(() => {})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭位置"> </HeaderNavbar>
    <van-sticky offset-top="2.875rem">
      <form action="/">
        <van-search
          v-model="search"
          shape="round"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @clear="searchList = []"
        >
        </van-search>
      </form>
      <div v-if="searchList.length > 0" class="map-localsearch__list">
        <van-cell
          v-for="(item, i) in searchList"
          :key="i"
          :title="item.name"
          :label="item.address"
          @click="selectSearchItem(item)"
        />
      </div>
    </van-sticky>
    <div class="map-warp">
      <div id="container"></div>
      <div class="map-collimation">
        <van-button
          round
          size="small"
          icon="aim"
          :loading="loading"
          @click="onAgainLoaction"
        ></van-button>
      </div>
      <div class="map-footer">
        <van-cell center label="定位不准？拖动地图手动定位">
          <template #title>
            <p class="tips">
              <label>经度：{{ lnglat?.lng }}</label>
              <label>维度：{{ lnglat?.lat }}</label>
            </p>
            <p>{{ formattedAddress }}</p>
          </template>
          <template #extra>
            <van-button size="small" :loading="loading" @click="onMapConfirm">
              确认位置
            </van-button>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-warp {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.map-localsearch__list {
  margin: 20px;
  max-height: 60vh;
  border-radius: 10px;
  z-index: 1; //父级元素scrollContainer加上定位position: absolute|relative，滑动几次后可滚动区域会卡主，不能在滑动
  overflow-x: hidden;
  overflow-y: scroll;
  // -webkit-backface-visibility: hidden;
  // transform          : translate3d(0, 0, .1); //修复快速滑动页面会出现空白，滑动停止后内容才显示
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

#container {
  width: 100vw;
  height: calc(100vh - 166px);
}
.map-collimation {
  position: fixed;
  bottom: 160px;
  left: 20px;
}
.map-footer {
  min-height: 10vh;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
  .tips {
    font-size: 12px;
    color: #999;
  }
}
</style>
