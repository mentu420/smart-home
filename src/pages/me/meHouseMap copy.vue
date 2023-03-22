<script setup>
import { showToast } from 'vant'
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { loadScript } from '@/utils/common.js'

const route = useRoute()
const loading = ref(false)
const lnglat = ref(null)
const formattedAddress = ref('')
const search = ref('')
const searchList = ref([])
const bmap = ref(null) //百度地图SDK
const state = reactive({
  form: {},
  map: null, // 地图对象
  markerInfo: {}, // 标记地理信息
})

const getWebPoint = () =>
  new Promise((resolve, reject) => {
    const geolocation = new bmap.value.Geolocation()
    console.log('getWebPoint', geolocation)
    geolocation.getCurrentPosition(function (r) {
      console.log(r)
      if (this.getStatus() == window.BMAP_STATUS_SUCCESS) {
        resolve(r)
      } else {
        reject(r)
      }
    })
  })

const onLoaclSearch = (value) => {
  return new Promise((resolve, reject) => {
    let local = new bmap.value.LocalSearch(state.map, {
      renderOptions: {
        map: state.map,
        selectFirstResult: false,
      },
      onSearchComplete: function (res) {
        if (res) {
          resolve(res.Yr || [])
          return
        }
        reject(res)
      },
    })
    local.search(value)
  })
}

const onSearch = async (value) => {
  searchList.value = await onLoaclSearch(value)
}

const setLoacl = ({ point }) => {
  setAdress(point)
  lnglat.value = point
  setMarker(state.map, point)
  state.map.panTo(point)
  searchList.value = []
}

// 重新定位
const onAgainLoaction = async () => {
  try {
    loading.value = true
    const { point } = await getWebPoint()
    console.log('onAgainLoaction point', point)
    setAdress(point)
    lnglat.value = point
    setMarker(state.map, point)
    state.map.panTo(point)
  } catch (error) {
    console.warn('onAgainLoaction', error)
  } finally {
    loading.value = false
  }
}

const onMapConfirm = () => {
  const { lng, lat } = lnglat.value
  state.form = {
    ...state.form,
    longitude: lng,
    latitude: lat,
    locateTheAddress: formattedAddress.value,
  }
  // 保存位置
}

const setAdress = (point) =>
  new Promise((resolve) => {
    const gc = new bmap.value.Geocoder()
    gc.getLocation(point, (rs) => {
      const addComp = rs.addressComponents
      formattedAddress.value = `${addComp.province} ${addComp.city} ${addComp.district} ${addComp.district} ${addComp.street} ${addComp.streetNumber}`
      resolve(rs)
    })
  })

const setMarker = (map, point) => {
  map.clearOverlays()
  const marker = new bmap.value.Marker(point) // 创建标注
  map.addOverlay(marker) // 将标注添加到地图中
  marker.setAnimation(window.BMAP_ANIMATION_DROP) //跳动的动画
}

//初始化地图
const initMap = (longitude, latitude, city) => {
  try {
    loading.value = true
    // 百度地图API功能
    const map = new bmap.value.Map('container')
    map.addControl(new bmap.value.NavigationControl())

    if (longitude == 0 && latitude == 0) map.centerAndZoom(city, 13)
    const point = new bmap.value.Point(longitude, latitude)
    map.centerAndZoom(point, 15)

    setMarker(map, point)

    // //单击获取点击的经纬度
    map.addEventListener('click', (e) => {
      setMarker(map, e.point)
      setAdress(e.point)
      lnglat.value = e.point
    })
    return map
  } catch (error) {
    showToast('地图初始化失败' + error.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadScript('https://api.map.baidu.com/api?v=2.0&ak=p1O8Y4aGh217cGMP1GMnpDleXGPqkxKp')
    bmap.value = window.BMap
    const { longitude = 116.404, latitude = 39.915, city = '北京' } = state.form
    state.map = initMap(longitude, latitude, city)
  } catch (error) {
    console.warn(error)
  }
})

onUnmounted(() => {
  state.map = null
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭位置">
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
          :title="item.title"
          :label="item.address"
          @click="setLoacl(item)"
        />
      </div>
    </HeaderNavbar>
    <div class="map-warp">
      <div id="container"></div>
      <div class="map-collimation">
        <van-button
          round
          size="small"
          icon="aim"
          type="primary"
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
            <van-button type="primary" size="small" :loading="loading" @click="onMapConfirm">
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
