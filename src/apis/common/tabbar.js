import { request } from '@/utils/request/'

export const login = (data) => request({ url: 'YongHu.aspx', data, method: 'POST' })
//短信
//type:1 身份验证；2短信测试；3登陆确认验证码；4登陆异常验证码；5用户注册验证码;6活动确认验证码；7修改密码验证码；8信息变更验证码；9分享钥匙
export const getCode = (params) => request({ url: 'DuanXin.aspx', params })
