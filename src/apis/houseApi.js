import { request } from '@/utils/request/'

/**
 * 房屋相关接口。op=1获取、op=2新增、op=3编辑、op=4删除、op=5 切换
 * **/
export const getHouseList = (params) => request({ url: '/V1/FangWu.aspx', params })
//添加或者编辑房屋
export const setHouseItem = (config) =>
  request({ url: '/V1/FangWu.aspx', ...config, method: 'POST' })

/**
 * 房间相关接口。op=1获取、op=2新增、op=3编辑、op=4删除
 * **/
export const getRoomList = (params) => request({ url: '/V1/FangJian.aspx', params })

export const setRoomList = (config) =>
  request({ url: '/V1/FangJian.aspx', ...config, method: 'POST' })

/**
 * 楼层相关接口。op=1获取、op=2新增、op=3编辑、op=4删除
 * **/
export const getFloorList = (params) => request({ url: '/V1/QuYu.aspx', params })

export const setFloorList = (config) => request({ url: '/V1/QuYu.aspx', ...config, method: 'POST' })

/**
 * 成员相关接口。
 * **/
export const setFamily = (config) =>
  request({ url: '/V1/ChengYuan.aspx', method: 'POST', ...config })

export const getFamily = (params) => request({ url: '/V1/ChengYuan.aspx', params })

/**
 * 首页排序
 * **/
export const setCollectSort = (config) =>
  request({ url: '/V1/YongHu.aspx', method: 'POST', ...config })
