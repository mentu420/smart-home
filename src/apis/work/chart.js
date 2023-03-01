import { request } from '@/utils/request/'

//获取城市等级
export const getCityLevel = (params) =>
  request({ url: '/cd-sys-web/v1/app/report/getCityLevel', params })

/*******销售额报表********/
//获取区域销售额
export const getAreaSales = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/area/sales', params })

//获取门店销售额
export const getSumStoreSales = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/getSumSales', params })

//获取门店销售额
export const getStoreSales = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/shops/sales', params })

/*******坪效*******/
//获取坪效-整体
export const getAreaEffectiveness = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/area/effectiveness', params })

//获取坪效-门店
export const getSiglyEffectiveness = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/area/effectiveness/shop', params })

/*******人效*******/
//获取人效-门店
export const getPeopleEffective = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/people/work', params })

//获取人效个人各门店
export const getStoreEffective = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/people/work/shop', params })

/*******天三角*******/
//获取进店数-整体
export const getSumEnter = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/storeNumber', params })

//获取成交率-整体
export const getSumRatio = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/ratioNumber', params })

//获取客单值-整体
export const getSumOrder = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/orderNumber', params })

//获取进店数-各门店
export const getSinglyEnter = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/store/number', params })

//获取成交率-各门店
export const getSinglyRatio = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/store/turnover/ratio', params })

//获取客单值-各门店
export const getSinglyOrder = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/store/guest/order', params })

/*******品牌*******/
//获取品牌对比数据
export const getBrandsContrast = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/brand/proportion', params })

//获取品类对比数据
export const getCategoryContrast = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/category/proportion', params })

//获取各门店整体销售额
export const getSalesByStore = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/user/sales', params })

//-----品牌品类------
//获取品类销售额对比数据
export const getCategorySales = (params) =>
  request({ url: '/cd-sys-web/v1/app/report/brand/category/sales', params })

//获取品类数量对比数据
export const getCategoryQuantity = (params) =>
  request({ url: '/cd-sys-web/v1/app/report/brand/category/quantity', params })

/********客户来源**********/
//获取品类数量对比数据
export const getCustomerSource = (params) =>
  request({ url: '/cd-sys-web/v2/app/report/customer/source', params })

//获取客户来源各门店
export const getShopSource = (params) =>
  request({ url: '/cd-sys-web/v1/app/dealer/report/customer/source/shop', params })

//获取人物排行
export const getEmployeeSort = (params) =>
  request({ url: '/cd-sys-web/v1/app/top/employee/sales', params })

//获取产品排行
export const getProductSort = (params) =>
  request({ url: '/cd-sys-web/v1/app/top/product/sales', params })

//获取
export const getCityByDealerBoss = (params) =>
  request({ url: '/cd-sys-web/v3/app/getCityByDealerBoss', params })
