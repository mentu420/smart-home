import { request } from '@/utils/request/'

/**
 * 用户相关接口。op=0登录、op=1信息查询、op=2信息修改、op=3密码修改、op=4设置密码、op=5忘记密码、op=6退出登录
 * **/
export const setUserConfig = (data) => request({ url: '/yonghu.aspx', data, method: 'POST' })
