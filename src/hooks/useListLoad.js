import { computed, ref, onMounted, toRefs } from 'vue'

/***
 * 配合vant van-pull-refresh van-list 使用
 *
 * @request  {(...any)=>Promise<any>}  请求分页数据方法
 * @options  {object} [options] 配置 autoRequest：是否自动请求第一页数据、pageIndexKey：当前页字段、pageSizeKey：总页数字段、dataKey：返回数组字段、totalPageKey：总条数字段
 * @success {success} 对请求结果进行处理
 * ***/

export const useListLoad = (props) => {
  const {
    autoRequest = true,
    pageIndexKey = 'page',
    pageSizeKey = 'limit',
    dataKey = 'page',
    success,
  } = props.options || {}

  const list = ref([])
  // 加载中
  const loading = ref(false)
  // 加载更多中
  const moreLoading = ref(false)
  // 全部数据加载完成
  const finished = ref(false)

  const errMessage = ref(null)

  const pagingParams = ref({
    [pageIndexKey]: 1,
    [pageSizeKey]: 10,
  })
  let curstomParams = {}

  const loadData = async () => {
    const result = await props.request({
      ...pagingParams.value,
      ...curstomParams,
    })
    if (pagingParams.value[pageIndexKey] === 1) {
      list.value = []
    }
    if (result.code != 0) {
      errMessage.value = result.msg
      return
    }
    errMessage.value = null
    if (success) {
      const { totalPage, data } = success(result)
      finished.value = totalPage <= pagingParams.value[pageIndexKey]
      list.value.push(...data)
    } else {
      const totalPage = result.totalPage || result[dataKey].totalPage
      finished.value = totalPage <= pagingParams.value[pageIndexKey]
      list.value.push(...result[dataKey].list)
    }
  }

  const onReload = async (params) => {
    try {
      window?.scroll({ top: 0 })
      loading.value = true
      pagingParams.value[pageIndexKey] = 1
      if (params) {
        curstomParams = params
      }
      await loadData()
    } finally {
      loading.value = false
    }
  }
  const onMore = async () => {
    try {
      if (finished.value) return
      pagingParams.value[pageIndexKey] = pagingParams.value[pageIndexKey] + 1
      moreLoading.value = true
      await loadData()
    } finally {
      moreLoading.value = false
    }
  }

  if (autoRequest) {
    onMounted(onReload)
  }

  return {
    list,
    loading,
    moreLoading,
    finished,
    errMessage,
    onReload,
    onMore,
  }
}
