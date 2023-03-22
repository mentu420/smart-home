import AMapLoader from '@amap/amap-jsapi-loader'

//加载AMap sdk
export const mapLoad = ({
  key = 'f779423097680cec06e6057d07ddede2',
  version = '2.0',
  plugins = ['AMap.CitySearch'],
  securityJsCode = 'f85f2ef5d162fe5a57b6d6d8d9157c4f',
}) => {
  window._AMapSecurityConfig = {
    securityJsCode,
  }
  return AMapLoader.load({
    key, // 申请好的Web端开发者Key，首次调用 load 时必填
    version, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
}

// 使用IP定位获取当前城市信息
export const getCityInfoByIp = (AMap) => {
  return new Promise((resolve, reject) => {
    var citySearch = new AMap.CitySearch()
    citySearch.getLocalCity(function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        // 查询成功，result即为当前所在城市信息
        resolve(result)
      } else {
        reject(result)
      }
    })
  })
}
