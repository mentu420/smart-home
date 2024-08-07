<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'

import { getRoomList, setRoomList, setFloorList, getFloorList } from '@/apis/houseApi'
import { validKeyboard } from '@/hooks/useFormValidator'
import houseStore from '@/store/houseStore'
import { objDelByValues } from '@/utils/common'
import { showConfirmDialog } from 'vant'

defineOptions({ name: 'MeRoomManage' })

const route = useRoute()

const defineRoomList = ref([
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

const activeNames = ref([0])
const checkboxRefs = ref([]) // 默认房间checkbox
const showRoomChecked = ref(false) // 是否打开默认房间列表
const showRoomForm = ref(false) // 是否打开房间自定义
const showAddFloor = ref(false) //是否打开楼层弹框
const loading = ref(false)
const roomForm = ref({ checked: [] }) //记录新增、编辑房间表单
const floorForm = ref({ op: 2, label: '' }) // 楼层数据表单
const disabled = ref(true) //禁止编辑
const dragDisabled = ref(true) // 是否拖拽
const floorList = ref([])
const { currentHouse } = storeToRefs(houseStore())

// 异步函数
const onAwaitLoad = async (func) => {
  try {
    loading.value = true
    await func()
  } finally {
    loading.value = false
  }
}

const addFloorItem = () => {
  showAddFloor.value = true
  floorForm.value = { op: 2 }
}

const onEditFloor = (item) => {
  showAddFloor.value = true
  floorForm.value = { op: 3, id: item.id, label: item.label }
}

// 删除楼层
const onDelFloor = (floorItem) => {
  onAwaitLoad(async () => {
    await showConfirmDialog({ title: '提示', message: `是否删除${floorItem.label}楼层` })
    await getFloorList({ op: 4, quyubianhao: floorItem.id, fangwubianhao: route.query.id })
    await onRefresh()
    showAddFloor.value = false
  })
}

// 编辑楼层
const onUpdateFloor = () => {
  onAwaitLoad(async () => {
    const { op, label, id } = floorForm.value
    const config = {
      params: { op },
      data: objDelByValues(
        {
          bianhao: id,
          mingcheng: label,
          fangwubianhao: route.query.id,
          paixu: floorList.value.length,
        },
        [undefined, null]
      ),
    }
    await setFloorList(config)
    await onRefresh()
    showAddFloor.value = false
  })
}

//打开房间新增
const openAddRoom = (floorItem) => {
  showRoomChecked.value = true

  roomForm.value = {
    fId: floorItem.id,
    checked: [],
  }
}

// 删除房间
const onDelectRoom = async (roomItem) => {
  onAwaitLoad(async () => {
    await showConfirmDialog({ title: '提示', message: `是否删除 ${roomItem.label} 房间` })
    await getRoomList({ op: 4, fangjianbianhao: roomItem.id, fangwubianhao: route.query.id })
    await onRefresh()
  })
}

// 打开房间编辑表单
const openRoomEdit = (roomItem = {}) => {
  roomForm.value = {
    ...roomForm.value,
    id: roomItem?.id,
    label: roomItem?.label,
    op: roomItem.op,
  }
  showRoomForm.value = true
}

// 新增房间
const onAddRoomItem = () => {
  onAwaitLoad(async () => {
    await Promise.all(
      roomForm.value.checked.map(async (checkedItem) => {
        const data = {
          fangwubianhao: route.query.id,
          quyubianhao: roomForm.value.fId,
          mingcheng: checkedItem,
        }
        await setRoomList({ params: { op: 2 }, data })
        return ''
      })
    )
    await onRefresh()
    showRoomChecked.value = false
  })
}

// 提交自定义房间
const onSubmitRoomCustom = () => {
  // 根据op 请求
  const { id, fId, label, op } = roomForm.value
  onAwaitLoad(async () => {
    const data = {
      bianhao: id,
      mingcheng: label,
      quyubianhao: fId,
      fangwubianhao: route.query.id,
    }
    await setRoomList({ params: { op }, data })
    await onRefresh()
    showRoomForm.value = false
    showRoomChecked.value = false
  })
}

const onEdit = async () => {
  disabled.value = !disabled.value
}

const onDragEnd = async () => {
  dragDisabled.value = !dragDisabled.value
  if (!dragDisabled.value || floorList.value.length == 0) return

  onAwaitLoad(async () => {
    //这里只需要更新排序
    const floorSortRes = floorList.value.map((item, i) => ({ quyubianhao: item.id, paixu: i }))

    const roomSortRes = floorList.value
      .map((floorItem) =>
        floorItem.roomList.map((roomItem, i) => ({ fangjianbianhao: roomItem.id, paixu: i }))
      )
      .flat()

    await Promise.all([
      setFloorList({ params: { op: 7 }, data: floorSortRes }),
      setRoomList({ params: { op: 7 }, data: roomSortRes }),
    ])
    const { useGetRoomListSync, useGetFloorListSync } = houseStore()
    await Promise.all([useGetFloorListSync(true), useGetRoomListSync(true)])
  })
}

async function init() {
  try {
    loading.value = true
    const { data } = await getRoomList({ op: 5, fangwubianhao: route.query.id })
    floorList.value = data
      .map((floorItem) => {
        return {
          ...floorItem,
          id: floorItem.bianhao,
          label: floorItem.mingcheng,
          sort: floorItem.paixu,
          roomList: floorItem.fangjians
            .map((roomItem) => {
              return {
                ...roomItem,
                id: roomItem.bianhao,
                label: roomItem.mingcheng,
                sort: roomItem.paixu,
              }
            })
            .sort((a, b) => a.sort - b.sort),
        }
      })
      .sort((a, b) => a.sort - b.sort)
  } finally {
    loading.value = false
  }
}

init()

async function onRefresh() {
  // 编辑的是当前房屋将更新缓存数据
  if (currentHouse.value?.id == route.query.id) {
    const { useGetRoomListSync, useGetFloorListSync, useSetRoomItem } = houseStore()
    await Promise.all([useGetFloorListSync(true), useGetRoomListSync(true)])
  }
  init()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="房间管理">
      <template #right>
        <van-button
          class="!px-4"
          round
          size="small"
          :loading="loading"
          :disabled="!dragDisabled"
          @click="onEdit"
        >
          {{ disabled ? '编辑' : '完成' }}
        </van-button>
        <van-button
          class="!px-4 !ml-2"
          round
          size="small"
          :loading="loading"
          :disabled="!disabled"
          @click="onDragEnd"
        >
          {{ dragDisabled ? '排序' : '完成' }}
        </van-button>
      </template>
    </HeaderNavbar>

    <van-collapse
      v-if="floorList.length > 0"
      v-model="activeNames"
      class="p-4"
      :border="false"
      :class="{ 'mr-8': !dragDisabled }"
    >
      <draggable v-model="floorList" item-key="id" :disabled="dragDisabled" group="floor">
        <template #item="{ element: floorItem }">
          <van-collapse-item
            :title="floorItem.label"
            class="mb-4 rounded-lg overflow-hidden"
            center
          >
            <template #title>
              <div class="flex items-center">
                <van-icon v-if="!dragDisabled" name="wap-nav" class="mr-2" />

                <label>{{ floorItem.label }}</label>
              </div>
              <div v-if="!disabled" class="space-x-4 my-2">
                <van-button
                  round
                  class="!px-4"
                  size="small"
                  icon="edit"
                  :loading="loading"
                  @click.stop="onEditFloor(floorItem)"
                  >编辑</van-button
                >
                <van-button
                  v-if="!floorItem?.roomList?.some((item) => item.deviceCount > 0)"
                  round
                  class="!px-4"
                  size="small"
                  type="danger"
                  icon="delete-o"
                  :loading="loading"
                  @click.stop="onDelFloor(floorItem)"
                  >删除</van-button
                >
              </div>
            </template>

            <draggable
              v-model="floorItem.roomList"
              item-key="id"
              :disabled="dragDisabled"
              :group="floorItem.id"
            >
              <template #item="{ element: roomItem }">
                <van-cell :border="false" center>
                  <template #title>
                    <div class="flex items-center">
                      <van-icon v-if="!dragDisabled" name="wap-nav" class="mr-2" />
                      <label>{{ roomItem.label }}</label>
                    </div>
                  </template>
                  <template #label>
                    <div v-if="!disabled" class="space-x-4">
                      <van-button
                        round
                        class="!px-4"
                        size="small"
                        icon="edit"
                        :loading="loading"
                        @click.stop="openRoomEdit({ ...roomItem, op: 3 })"
                      >
                        编辑
                      </van-button>
                      <van-button
                        v-if="roomItem.shebeishu == 0 && roomItem.changjingshu == 0"
                        round
                        class="!px-4"
                        size="small"
                        icon="delete-o"
                        type="danger"
                        :loading="loading"
                        @click="onDelectRoom(roomItem)"
                      >
                        删除
                      </van-button>
                    </div>
                    <div v-if="disabled && dragDisabled" class="space-x-2 text-xs">
                      <label v-if="roomItem.shebeishu > 0"> {{ roomItem.shebeishu }}个设备 </label>
                      <label v-if="roomItem.changjingshu > 0">
                        {{ roomItem.changjingshu }}个场景
                      </label>
                    </div>
                  </template>
                </van-cell>
              </template>
            </draggable>

            <van-button
              v-if="disabled & dragDisabled"
              round
              class="!px-4"
              size="small"
              icon="add-o"
              :loading="loading"
              @click.stop="openAddRoom(floorItem)"
            >
              添加房间
            </van-button>
          </van-collapse-item>
        </template>
      </draggable>
    </van-collapse>

    <div v-if="disabled && dragDisabled" class="p-4 pb-safe-offset-4">
      <van-button class="!px-4" round block :loading="loading" @click="addFloorItem">
        添加楼层
      </van-button>
    </div>

    <!--新增房间-->
    <van-popup v-model:show="showRoomChecked" round teleport="body" position="bottom">
      <div class="py-4">
        <div class="flex justify-between p-4 items-center">
          <van-button
            class="!px-4"
            round
            type="default"
            size="small"
            :loading="loading"
            @click="showRoomChecked = false"
          >
            取消
          </van-button>
          <div>新增房间</div>
          <van-button class="!px-4" round size="small" :loading="loading" @click="onAddRoomItem">
            确定
          </van-button>
        </div>
        <van-checkbox-group v-model="roomForm.checked">
          <van-cell-group inset>
            <van-cell
              v-for="(roomItem, index) in defineRoomList"
              :key="index"
              clickable
              :title="roomItem.text"
              @click="checkboxRefs[index].toggle()"
            >
              <template #right-icon>
                <van-checkbox
                  :ref="(el) => (checkboxRefs[index] = el)"
                  :name="roomItem.text"
                  @click.stop
                />
              </template>
            </van-cell>
            <van-cell title="自定义" is-link @click="openRoomEdit({ op: 2 })"></van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>

    <!--房间编辑-->
    <van-popup v-model:show="showRoomForm" round teleport="body" position="center" closeable>
      <van-form class="p-4" @submit="onSubmitRoomCustom">
        <div class="pb-4">{{ roomForm.op != 2 ? '编辑' : '添加' }}房间</div>
        <van-field
          v-model.trim="roomForm.label"
          name="label"
          label="房间名称"
          placeholder="请填写房间名称"
          :rules="[{ required: true, message: '房间名称不能为空' }]"
        />
        <div class="pt-8 pb-4">
          <van-button round block native-type="submit" :loading="loading"> 提交 </van-button>
        </div>
      </van-form>
    </van-popup>

    <!--楼层编辑弹框-->
    <van-popup v-model:show="showAddFloor" round teleport="body" position="center" closeable>
      <van-form class="p-4" @submit="onUpdateFloor">
        <div class="pb-4">{{ floorForm.op != 2 ? '编辑' : '添加' }}楼层</div>
        <van-field
          v-model.trim="floorForm.label"
          name="label"
          label="楼层名称"
          placeholder="请填写楼层名称"
          :rules="[
            { required: true, message: '楼层名称不能为空' },
            { validator: (value) => validKeyboard(value), message: '只能填写中英文、数字与.' },
          ]"
        />

        <div class="pt-8 pb-4">
          <van-button round block native-type="submit" :loading="loading"> 提交 </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
