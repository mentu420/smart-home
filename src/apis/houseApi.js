import { request } from '@/utils/request/'

/**
 * 房屋成员相关接口。op=1添加、op=2编辑、op=3删除、op=4获取
 * **/
export const setHouseMember = (config) =>
  request({ url: '/V1/ChengYuan.aspx', ...config, method: 'POST' })

export const getHouseMember = (params) => request({ url: '/V1/ChengYuan.aspx', params })

/**
 * 房屋相关接口。op=1获取、op=2新增、op=3编辑、op=4删除、op=5 切换
 * **/
export const getHouseList = (params) => request({ url: '/V1/FangWu.aspx', params })
//添加或者编辑房屋
export const setHouseList = (data) =>
  request({ url: '/FangWu.aspx', params: { op: 2 }, data, method: 'POST' })

/**
 * 房间相关接口。op=1获取、op=2新增、op=3编辑、op=4删除
 * **/
export const getRoomList = (params) => request({ url: '/V1/FangJian.aspx', params })

export const setRoomList = (config) =>
  request({ url: '/V1/FangJian.aspx', ...config, method: 'POST' })

/**
 * 区域相关接口。op=1获取、op=2新增、op=3编辑、op=4删除
 * **/
export const getAreaList = (params) => request({ url: '/V1/QuYu.aspx', params })

export const setAreaList = (config) => request({ url: '/V1/QuYu.aspx', ...config, method: 'POST' })
