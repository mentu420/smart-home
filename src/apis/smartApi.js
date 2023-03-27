import { request } from '@/utils/request/'

/**
 * 设备相关接口。op=1获取、op=3编辑、op=4 收藏设备/收藏排序/取消收藏
 * **/
export const getDeviceList = (params) => request({ url: '/V1/SheBei.aspx', params })

export const setDeviceList = (data) => request({ url: '/V1/SheBei.aspx', data, method: 'POST' })

/**
 * 房屋相关接口。op=1获取、op=2新增、op=3编辑、op=4删除、op=5 收藏/取消收藏/更新排序
 * **/
export const getSceneList = (params) => request({ url: '/V1/ChangJing.aspx', params })

export const setSceneList = (data) => request({ url: '/V1/ChangJing.aspx', data, method: 'POST' })
