import { mqttScenePublish } from '@/hooks/useMqtt'
import { storeToRefs } from 'pinia'
import smartStore from '@/store/smartStore'
import { showToast } from 'vant'

const { sceneList } = storeToRefs(smartStore())

/**
 * 只要没有收到mqtt的消息ok反馈，就会一直转转，直到超时
 * 一个场景没有执行完，不能执行其他场景，设备控制不管控
 * **/
export const onScenePublishDebounce = (id) => {
  const sceneItem = sceneList.value.find((item) => item.loading)
  if (sceneItem) {
    showToast({ message: `正在执行${sceneItem?.label}，请稍后再试。。。`, position: 'bottom' })
    return
  }
  mqttScenePublish({ id })
}
