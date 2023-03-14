import { request } from '@/utils/request/'

/**
 * 短信相关接口。leixing=1注册验证码、leixing=2找回密码验证码、leixing=3验证码登录
 * **/
export const getSms = (params) => request({ url: '/DuanXin.aspx', params })
/**
 * 短信相关接口。op=1
 * **/
export const uploadFile = (params) => request({ url: '/FileUpload.aspx', params })

/**
 * 用户相关接口。op=0登录、op=1信息查询、op=2信息修改、op=3密码修改、op=4设置密码、op=5忘记密码、op=6退出登录
 * **/
export const setUserConfig = (data) => request({ url: '/yonghu.aspx', data, method: 'POST' })

export const getUserConfig = (params) => request({ url: '/yonghu.aspx', params })
