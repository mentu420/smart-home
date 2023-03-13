import { request } from '@/utils/request/'

/**
 * 短信相关接口。leixing=1注册验证码、leixing=2找回密码验证码、leixing=3验证码登录
 * **/
export const getSms = (params) => request({ url: '/DuanXin.aspx', params })
/**
 * 短信相关接口。op=1
 * **/
export const uploadFile = (params) => request({ url: '/FileUpload.aspx', params })
