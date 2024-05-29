import { storeToRefs } from 'pinia'
import smartStore from '@/store/smartStore'
import { showToast } from 'vant'
import socketStore from '@/store/socketStore'

const { sceneList } = storeToRefs(smartStore())

/**
 * 只要没有收到mqtt的消息ok反馈，就会一直转转，直到超时
 * 一个场景没有执行完，不能执行其他场景，设备控制不管控
 * **/
export const onScenePublishDebounce = async (id) => {
  const { setSceneLoading } = smartStore()
  const sceneItem = sceneList.value.find((item) => item.loading)
  if (sceneItem) {
    showToast({ message: `正在执行${sceneItem?.label}，请稍后再试。。。`, position: 'bottom' })
    return
  }
  // setSceneLoading(id, true)
  // await new Promise((resolve) => setTimeout(resolve, 2000))
  socketStore().mqttScenePublish({ id })
  setTimeout(() => {
    const sceneItem = sceneList.value.find((item) => item.id == id)
    if (!sceneItem?.loading) return
    setSceneLoading(id, false)
    showToast({ message: `场景${sceneItem?.label}操作失败` })
  }, 30 * 1000)
}
