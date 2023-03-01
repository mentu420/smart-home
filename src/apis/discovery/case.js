import { request } from '@/utils/request/'

//根据用户账号查询用户收藏的案例
export const collectlist = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/collectlist',
    params,
  })
}

//我的案例
export const goodCaseList = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/list',
    params,
  })
}

//删除案例
export const goodCaseDelete = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/delete',
    params,
  })
}

//根据案例id查看详情
export const goodCaseDetails = (params) => {
  return request(
    {
      url: '/consumer-admin/api/goodCase/details',
      params,
    },
    false
  )
}

//获取所有有效品牌
export const brandList = (params) => {
  return request({
    url: '/consumer-admin/api/good/brand/list',
    params,
  })
}

//获取所有有效品类
export const categoryList = (params) => {
  return request({
    url: '/consumer-admin/api/good/category/list',
    params,
  })
}
//.关键字模糊搜索产品型号
export const getModelno = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/getmodelno',
    params,
  })
}

//关键字模糊搜索产品名称
export const getNames = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/getnames',
    params,
  })
}

//关键字模糊搜索产品名称
export const getGoods = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/getGoods',
    params,
  })
}

//关键字模糊搜索产品名称
export const topNames = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/topNames',
    params,
  })
}

//.新增案例
export const goodCaseSave = (data) =>
  request({
    url: '/consumer-admin/v1/api/goodCase/save',
    data,
    headers: { contentType: 'multipart/form-data' },
    method: 'post',
  })

//.修改案例
export const goodCaseUpdate = (data) =>
  request({
    url: '/consumer-admin/v1/api/goodCase/update',
    data,
    headers: { contentType: 'multipart/form-data' },
    method: 'post',
  })

//上传图片
export const uploadFile = (data) =>
  request({
    url: '/consumer-admin/upload/file',
    data,
    headers: { contentType: 'multipart/form-data' },
    method: 'post',
  })

//.根据品牌查询案例产品列表(查每个品类的前6条数据)
export const goodsbybrand = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/product/goodsbybrand',
    params,
  })
}

//（更多）根据品牌品类查询案例产品列表
export const productGoods = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/product/goods',
    params,
  })
}

//（更多）搜索获取案例库内数据
export const casegoodsnames = (params) => {
  return request({
    url: '/consumer-admin/v1/api/goodCase/casegoodsnames',
    params,
  })
}
