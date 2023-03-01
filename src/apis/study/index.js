import { request } from '@/utils/request/'

//获取直播中列表
export const getLivingList = (params) =>
  request({ url: '/consumer-admin/api/live/history/effective', params })

//获取直播列表
export const getLiveList = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/list', params })

//获取直播详情
export const getLiveDetail = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/detail', params })

//获取用户观看时长
export const getLiveWatchTime = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/getReplayWatchRecord', params })

//进入直播间
export const enterLive = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/enter', params })

//离开直播间
export const leaveLive = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/leave', params })

//检查是否预约
export const subscribeLiveCheck = (params) =>
  request({
    url: '/consumer-admin/api/live/cd/train/subscription/appoint/check',
    params,
  })

//直播预约
export const subscribeLive = (params) =>
  request({
    url: '/consumer-admin/api/live/cd/train/subscription/appoint',
    params,
  })

//回放列表
export const getRepeatLiveList = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/subject/list', params })

//专题详情
export const getRepeatDetail = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/replay/list', params })

//直播回放
export const getPlayback = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/replay/detail', params })

//上传TIM用户信息
export const saveTimUser = (params) =>
  request({ url: '/consumer-admin/api/im/accountImport', params })

//获取TIM登录密钥
export const getTimSign = (params) => request({ url: '/consumer-admin/api/im/genSig', params })

//获取直播公告
export const getLiveNotice = (params) =>
  request({
    url: '/consumer-admin/api/live/cd/train/lecturer/notice',
    params,
  })

//支付直播订单
export const getLivePayData = (data) =>
  request({
    url: '/consumer-admin/api/livehistorypay/pay',
    data,
    method: 'post',
  })
export const getWXWorkPayData = (data) =>
  request({
    url: '/consumer-admin/api/livehistorypay/saveOrder',
    data,
    method: 'post',
  })

//获取直播订单状态
export const getLiveOrderStatus = (params) =>
  request({
    url: '/consumer-admin/api/live/cd/train/payment/check',
    params,
  })

//直播间心跳
export const onHeart = (params) =>
  request(
    {
      url: '/consumer-admin/api/live/cd/train/online/add',
      params,
    },
    { withShowErrorMsg: false }
  )

//获取直播讲师列表
export const getLiveLector = (params) =>
  request(
    {
      url: '/consumer-admin/live/train/lecturer/id/get',
      params,
    },
    { withShowErrorMsg: false }
  )

//讲师发言（公告）
export const saveLiveLectorNotice = (params) =>
  request({ url: '/consumer-admin/live/train/lecturer/notice/save', params })

//获取直播文件
export const getLiveFiles = (params) =>
  request({
    url: '/consumer-admin/api/live/cd/train/getTrainFileList',
    params,
  })

//获取课程分类列表
export const getCourseClassify = (params) =>
  request({ url: '/consumer-admin/ctCommonType/list', params })

//获取课程列表
export const getCourseList = (params) => request({ url: '/consumer-admin/api/course/list', params })

//保存观看视频时长
export const saveDuration = (params) =>
  request({ url: '/consumer-admin/api/course/saveLook', params })

//获取课程详情
export const getCourseDetail = (params) =>
  request({ url: '/consumer-admin/api/course/detail', params })

//获取课程章节
export const getCourseSteps = (params) =>
  request({ url: '/consumer-admin/api/course/getChapterList', params })

//获取课程测试
export const getCourseAnswer = (params) =>
  request({
    url: '/consumer-admin/api/course/testing/list',
    params,
  })

//提交课程测试
export const submitCourseAnswer = (data) =>
  request({
    url: '/consumer-admin/api/course/testing/savelist',
    method: 'post',
    data,
  })

//获取直播回放列表=>所有专题里面的列表
export const getAllLiveBack = (params) =>
  request({ url: '/consumer-admin/api/live/cd/train/getReplayTopList', params })

export const youjiaSave = (params) =>
  request({
    url: '/consumer-admin/api/youjia/save',
    method: 'post',
    data: params,
  })
//轮播图
export const getIndexSlider = (classify) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/adverts',
    params: { classify: classify },
  })
//标签菜单
export const getCategory1List = (classify) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/category',
    params: {
      classify: classify,
      level: 1,
    },
  })
//置顶文章
export const getTopArt = (params) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/getTopRepository',
    params,
  })
export const getCategories = (categoryId) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/getCategoryList',
    params: {
      id: categoryId,
    },
  })
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
//收藏
export const setCollect = (params) =>
  request({ url: '/consumer-admin/api/user/collect/v1/collect', params })

//移除收藏接口
export const cancelCollect = (params) =>
  request({
    url: '/consumer-admin/api/user/collect/v1/cancelCollect',
    params,
  })
export const getArticleSearch = (params) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/getRepositoryByKey',
    params,
  })
