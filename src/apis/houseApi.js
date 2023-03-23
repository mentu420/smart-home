import { request } from '@/utils/request/'

/**
 * 房屋成员相关接口。op=1添加、op=2编辑、op=3删除、op=4获取
 * **/
export const setHouseMember = (data) => request({ url: '/ChengYuan.aspx', data, method: 'POST' })

export const getHouseMember = (params) => request({ url: '/ChengYuan.aspx', params })

/**
 * 房屋相关接口。op=1获取、op=2新增、op=3编辑、op=4删除、op=5 切换
 * **/
export const getHouseList = (params) => request({ url: '/FangWu.aspx', params })
//添加或者编辑房屋
export const setHouseList = (data) =>
  request({ url: '/FangWu.aspx', params: { op: 2 }, data, method: 'POST' })

/**
 * 房间相关接口。op=1获取、op=2新增、op=3编辑、op=4删除
 * **/
export const getRoomList = (params) => request({ url: '/FangJian.aspx', params })

export const setRoomList = (data) => request({ url: '/FangJian.aspx', data, method: 'POST' })

/**
 * 房间相关接口。op=1获取、op=2新增、op=3编辑、op=4删除
 * **/
export const getAreaList = (params) => request({ url: '/QuYu.aspx', params })

export const setAreaList = (data) => request({ url: '/QuYu.aspx', data, method: 'POST' })
