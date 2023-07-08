<script setup>
import Nzh from 'nzh'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { getRoomList, setRoomList, getAreaList } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'

const route = useRoute()
const activeNames = ref([])
const storeyList = ref([])
const checkboxRefs = ref([])
const roomList = ref([
  { text: '玄关', id: 0 },
  { text: '客厅', id: 1 },
  { text: '餐厅', id: 2 },
  { text: '主卧', id: 3 },
  { text: '次卧', id: 4 },
  { text: '儿童房', id: 5 },
  { text: '书房', id: 6 },
  { text: '衣帽间', id: 7 },
  { text: '保姆房', id: 8 },
  { text: '厨房', id: 9 },
  { text: '阳台', id: 10 },
  { text: '洗漱间', id: 11 },
])
const showChecked = ref(false)
const showForm = ref(false)
const roomForm = ref({ checked: [] }) // 记录当前选择的楼层与房间名称index=>楼层，checked: 选择的房间

const onAddStorey = () => {
  storeyList.value = [...storeyList.value, {}]
}
const onAddRoom = (storeyIndex) => {
  showChecked.value = true
  roomForm.value = { ...roomForm.value, index: storeyIndex, checked: [] }
}

const openForm = () => {
  showForm.value = true
}

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}

const setStoreyList = async () => {
  const { data } = await getRoomList({ op: 1 })
  storeyList.value = [{ roomList: data }]
}

const onDelectRoom = async (roomItem) => {
  await getRoomList({ op: 4, fangjianbianhao: roomItem.bianhao })
  setStoreyList()
}

const onCheckedConfirm = async () => {
  console.log('onCheckedConfirm', roomForm)
  showChecked.value = false
  await Promise.all(
    roomForm.value.checked.map(async (checkedItem) => {
      const data = {
        fangwubianhao: roomForm.value.fangwubianhao,
        quyubianhao: roomForm.value.quyubianhao,
        mingcheng: checkedItem,
      }
      await setRoomList({ params: { op: 2 }, data })
      return ''
    })
  )
  setStoreyList()
}

const onSubmit = async () => {
  const data = {
    fangwubianhao: roomForm.value.fangwubianhao,
    quyubianhao: roomForm.value.quyubianhao,
    mingcheng: roomForm.value.name,
  }
  await setRoomList({ params: { op: 2 }, data })
  showForm.value = false
  showChecked.value = false
}

const init = async () => {
  setStoreyList()
  const { data } = await getAreaList({ op: 1 })
  roomForm.value = {
    ...roomForm.value,
    fangwubianhao: data[0].fangwubianhao,
    quyubianhao: data[0].bianhao,
  }
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="房间管理">
      <template #right>
        <van-button size="mini" type="primary" @click="onAddStorey">添加楼层</van-button>
      </template>
    </HeaderNavbar>
    <van-collapse v-model="activeNames">
      <van-collapse-item
        v-for="(storeyItem, storeyIndex) in storeyList"
        :key="storeyIndex"
        :title="`${Nzh.cn.encodeS(storeyIndex + 1)}楼`"
        center
      >
        <template #value>
          <van-button size="mini" type="primary" @click.stop="onAddRoom(storeyIndex)">
            添加房间
          </van-button>
        </template>
        <div class="flex flex-wrap py-2">
          <span
            v-for="roomItem in storeyItem.roomList"
            :key="roomItem.bianhao"
            class="relative mb-4 mr-4 rounded bg-gray-100 px-4 py-2 text-sm"
            color="#999"
          >
            <label>{{ roomItem.mingcheng }}</label>
            <span class="absolute -right-2 -top-2">
              <van-icon name="clear" @click="onDelectRoom(roomItem)" />
            </span>
          </span>
        </div>
      </van-collapse-item>
    </van-collapse>
    <van-popup v-model:show="showChecked" round teleport="body" position="bottom">
      <div class="py-4">
        <div class="flex justify-between p-4">
          <van-button type="default" size="mini" @click="showChecked = false">取消</van-button>
          <van-button type="primary" size="mini" @click="onCheckedConfirm">确定</van-button>
        </div>
        <van-checkbox-group v-model="roomForm.checked">
          <van-cell-group inset>
            <van-cell
              v-for="(roomItem, index) in roomList"
              :key="index"
              clickable
              :title="roomItem.text"
              @click="toggle(index)"
            >
              <template #right-icon>
                <van-checkbox
                  :ref="(el) => (checkboxRefs[index] = el)"
                  :name="roomItem.text"
                  @click.stop
                />
              </template>
            </van-cell>
            <van-cell title="自定义" is-link @click="openForm"></van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>
    <van-popup v-model:show="showForm" round teleport="body" position="center">
      <div class="py-4">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model.trim="roomForm.name"
              name="name"
              label="房间名称"
              placeholder="请填写房间名称"
              :rules="[{ required: true, message: '房间名称不能为空' }]"
            />
          </van-cell-group>
          <div class="p-4">
            <van-button round block type="primary" native-type="submit"> 提交 </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>
