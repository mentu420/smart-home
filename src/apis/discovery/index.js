import { request } from '@/utils/request/'

//知识库
//获取首页轮播图
export const getIndexSlider = (classify) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/adverts',
    params: { classify: classify },
  })

// 获取首页一级分类列表
export const getCategory1List = (classify) => {
  return request({
    url: '/consumer-admin/api/train/repository/v1/category',
    params: {
      classify: classify,
      level: 1,
    },
  })
}
//知识库首页置顶文章接口
export const getTopArt = (params) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/getTopRepository',
    params,
  })

//首页搜索接口
export const getArticleSearch = (keyword, account, classify) => {
  return request({
    url: '/consumer-admin/api/train/repository/v1/getRepositoryByKey',
    params: {
      key: keyword,
      account: account,
      classify: classify, //1代表金管家2代表学院
    },
  })
}
//分页列表接口
export const getCategories = (categoryId) => {
  return request({
    url: '/consumer-admin/api/train/repository/v1/getCategoryList',
    params: {
      id: categoryId,
    },
  })
}
//文章列表接口
export const getArticles = (params) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/queryByCategoryId',
    params,
  })

//文章详情接口
export const getArticleDetail = (params) =>
  request({ url: '/consumer-admin/api/train/repository/v1/get', params })

//文章详情接口2,分享专用
export const getArticleDetail2 = (params) =>
  request({ url: '/consumer-admin/api/train/repository/v1/get2', params })

// 品牌系列
export const getProductBrands = (params) => {
  return request({
    url: '/consumer-admin/goods/brandintroduce/listpage',
    params,
  })
}
// 更新品牌信息
export const setProductBrands = (data) =>
  request({
    url: '/consumer-admin/goods/brandintroduce/update/entity',
    method: 'post',
    data,
  })
// 更新品牌信息
export const syncSeriesList = () =>
  request({ url: '/consumer-admin/goods/brandintroduce/update/dealerBrand' })

//获取经销商品牌授权
export const getDealCategoryList = (params) =>
  request({ url: '/cdapi/shop/brand/detailList', params })

//收藏
export const setCollect = (params) =>
  request({ url: '/consumer-admin/api/user/collect/v1/collect', params })

//移除收藏接口
export const cancelCollect = (params) =>
  request({ url: '/consumer-admin/api/user/collect/v1/cancelCollect', params })

//获取问题分类列表接口
export const getQuestionCategoryList = (modular) => {
  return request({
    url: '/api/question/repository/v1/getCategoryList',
    params: {
      platform: '营销助手',
      modular,
    },
  })
}
//常见问题列表接口
export const questionList = (id, page, limit, modular) => {
  return request({
    url: '/api/question/repository/v1/getQuestionList',
    params: {
      platform: '营销助手',
      modular,
      categoryId: id, //  问题分类id
      page: page,
      limit: limit,
    },
  })
}
//常见问题详情接口
export const questionDetail = (params) => {
  return request({
    url: '/consumer-admin/api/question/repository/v1/get',
    params,
  })
}
//常见问题详情浏览
export const questionDetailWatch = (id) => {
  return request({
    url: '/consumer-admin/api/question/repository/v2/browse',
    params: {
      id: id,
    },
  })
}
//常见问题详情收藏
export const questionDetailCollection = (id) => {
  return request({
    url: '/api/question/repository/v1/collection',
    params: {
      id: id,
    },
  })
}
//图库
//品牌集合
export const getBrand = (params) => request({ url: '/consumer-admin/api/product/v1/brand', params })

//热门推荐//产品分类（幕思）
export const getAllCategory = () => request({ url: '/consumer-admin/api/product/v1/category' })

//品牌的产品列表
export const getBrandCategories = (params) =>
  request({ url: '/consumer-admin/api/product/v1/product/category', params })

//轮播图接口
export const getAdvert = (params) =>
  request({ url: '/consumer-admin/api/product/v1/advert', params })

//品牌介绍接口
export const getIntroduce = (params) =>
  request({ url: '/consumer-admin/api/product/v1/introduce', params })

//产品列表接口
export const getProductList = (params) =>
  request({
    url: '/consumer-admin/api/product/v1/product/list',
    params,
  })

//产品详情
export const getProductDetail = (params) =>
  request({
    url: '/consumer-admin/api/product/v1/product/details',
    params,
  })

//获取收藏文章/问题/产品接口
export const getCollect = (params) =>
  request({ url: '/consumer-admin/api/user/collect/v1/getcollect', params })
/* 
  工作模块 
*/
//获取订单列表
export const getOrderList = (params) => request({ url: '/cd-sys-web/v3/app/order/list', params })
//获取订单详情
export const getOrderDetails = (orderId) =>
  request({ url: '/cd-sys-web/v3/app/order', params: { orderId: orderId } })

//获取地址详情
export const getAddress = (id) => {
  return request({
    url: '/cd-sys-web/v2/app/address',
    params: { addressId: id },
  })
}

//保存反馈信息
export const feedback = (data) =>
  request({
    url: '/cd-sys-web/v2/api/feedback',
    method: 'post',
    data,
  })

//搜索意向产品
export const getProduct = (key) => {
  return request({ url: '/cd-sys-web/v2/app/product', params: { key: key } })
}

//获取参考系
export const getType = (type) => {
  return request({
    url: '/cd-sys-web/v2/=>app/reference',
    params: { type: type },
  })
}
//获取省市区
export const getCity = (type, code) => {
  return request({
    url: '/cd-sys-web/v1/api/public/address',
    params: { type: type, parentCode: code },
  })
}
//保存游客
export const getVisitor = (obj) => {
  return request({
    url: '/cd-sys-web/v3/app/customer/tourist',
    data: obj,
    method: 'post',
  })
}
//获取客户详情
export const getCustomerDetails = (params) => {
  return request({ url: '/cd-sys-web/v3/app/customer/details', params })
}
//获取意向详情
export const getOpportunity = (id) => {
  return request({
    url: '/cd-sys-web/v3/app/opportunity',
    params: { opportunityId: id },
  })
}
/* 
  个人模块  
*/

//门店店长-获取导购信息
export const getSleepUserList = (obj) => {
  return request({ url: '/cd-sys-web/v3/app/getSleepUserList', params: obj })
}
//门店店长-关联导购
export const saveOpportunitySleep = (data) => {
  return request({
    url: '/cd-sys-web/v3/app/opportunitySleep/save',
    method: 'post',
    data,
    headers: { contentType: 'multipart/form-data' },
  })
}
//门店店长-根据用户id获取工作台报表（id为店长时查询报表数据为门店总数据）
export const getUserReport = (obj) => {
  return request({ url: '/cd-sys-web/v3/app/staffDaily', params: obj })
}
//门店店长-获取员工列表
export const getEmployeeList = (obj) => {
  return request({ url: '/cd-sys-web/v3/app/shop/employee/list', params: obj })
}
//经销商市场主管-获取意向列表
export const getHeadquartersCustomer = (obj) => {
  return request({
    url: '/cd-sys-web/v3/app/customer/opportunity/headquarters',
    params: obj,
  })
}
//经销商-获取门店列表
export const getShopList = (obj) => {
  return request({ url: '/cd-sys-web/v3/app/boss/shop/list', params: obj })
}
//获取员工日报
export const getStaffDailyList = (obj) => {
  return request({
    url: '/cd-sys-web/v3/app/getstaffdailylist',
    params: obj,
    errToast: false,
  })
}
//根据员工id获取所属门店工作台报表
export const getStoreReport = (obj) => {
  return request({ url: '/cd-sys-web/v3/app/shopworkbench', params: obj })
}
//获取员工个人日报信息
export const getPerDaily = (obj) => {
  return request({ url: '/cd-sys-web/v3/app/getdaily', params: obj })
}
//根据门店id获取门店员工列表
export const getStoreEmployeeList = (obj) => {
  return request({ url: '/cd-sys-web/v3/app/shopuser', params: obj })
}
//查询客户列表
export const getCustomerList = (params) => {
  return request({ url: '/cd-sys-web/v3/app/customers2', params })
}
//查询客户意向列表
export const getOppList = (obj) => {
  return request({
    url: '/cd-sys-web/v3/app/customer/opportunitylist',
    params: obj,
  })
}
//根据工作计划id查看详情
export const getPlanDetail = (id) => {
  return request({
    url: '/cd-sys-web/v3/app/workplan/workplandetail',
    params: { id: id },
  })
}
//查询公告列表
export const getNoticeList = (params) =>
  request({ url: '/cd-sys-web/v3/app/notice/noticelist', params })

//查询公告详情
export const getNoticedDetail = (obj) => {
  return request({
    url: '/cd-sys-web/v3/app/notice/noticedetail',
    params: obj,
  })
}

//查询公告徽标
export const getNoticedReadCount = (params) => {
  return request(
    {
      url: '/cd-sys-web/v3/app/notice/reading/list',
      params,
    },
    { withShowErrorMsg: false }
  )
}

// 获取版本详情
export const getUpdateDetail = (id) => {
  return request({
    url: '/consumer-admin/api/appEditionLog/info',
    params: { id },
  })
}
//关联门店和意向（商机）
export const saveShop = (data) => {
  return request({
    url: '/cd-sys-web/v3/app/opportunity/saveshop',
    method: 'post',
    data,
    headers: { contentType: 'multipart/form-data' },
  })
}

// 获取运营平台产品管理的用户授权品牌
export const getSeriesListPowers = (params) => {
  return request({
    url: '/consumer-admin/goods/user/role/listpage',
    params,
  })
}
