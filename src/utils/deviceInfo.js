const userAgent = navigator.userAgent

const browser = {
  trident: userAgent.indexOf('Trident') > -1, //IE内核
  presto: userAgent.indexOf('Presto') > -1, //opera内核
  webKit: userAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
  gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1, //火狐内核
  mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
  ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
  android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1, //android终端
  iPhone: userAgent.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
  iPad: userAgent.indexOf('iPad') > -1, //是否iPad
  webApp: userAgent.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
  weixin: userAgent.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
  wxwork: userAgent.includes('wxwork'), //是否企业微信
}

//判断是模拟器还是真机 window => "Win32"  mac => "MacIntel"
const platform =
  navigator.platform === 'Win32' || navigator.platform == 'MacIntel'
    ? 'devtools'
    : navigator.platform

export default {
  browser,
  appVersion: navigator.appVersion,
  language: navigator.language.toLowerCase(),
  platform,
  system: userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'ios' : 'android',
  isIphoneX:
    platform != 'devtools' &&
    browser.ios &&
    (screen.height >= 812 || screen.height <= 896) &&
    screen.width == 375,
  isWechat: browser.weixin,
  isWechatWork: browser.wxwork,
}
