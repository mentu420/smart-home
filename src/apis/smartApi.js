import { request } from '@/utils/request/'

/**
 * 设备相关接口。op=1获取、op=3编辑、op=4 收藏设备/收藏排序/取消收藏
 * **/
export const getDeviceList = (params) => request({ url: '/V1/SheBei.aspx', params })

export const setDeviceList = (config) =>
  request({ url: '/V1/SheBei.aspx', ...config, method: 'POST' })

/**
 * 场景相关接口。op=1获取、op=2新增、op=3编辑、op=4删除、op=5 收藏/取消收藏/更新排序
 * **/
export const getSceneList = (params) => request({ url: '/V1/ChangJing.aspx', params })

export const setSceneList = (config) =>
  request({ url: '/V1/ChangJing.aspx', ...config, method: 'POST' })

/**
 * 自动化相关接口。op=1获取、op=2新增、op=3编辑、op=4删除、op=5 收藏/取消收藏/更新排序
 * **/
export const getSmartList = (params) => request({ url: '/V1/ZhiNengHua.aspx', params })

export const setSmartList = (config) =>
  request({ url: '/V1/ZhiNengHua.aspx', ...config, method: 'POST' })

/**
 * 获取设备图片图标
 * **/
export const getDeviceResource = (params) =>
  request({ url: '/V1/PinLei.aspx', params: { op: 1, ...params } })
