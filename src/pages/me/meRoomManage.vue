<script setup>
import { load } from '@amap/amap-jsapi-loader'
import Nzh from 'nzh'
import { storeToRefs } from 'pinia'
import { showConfirmDialog } from 'vant'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { getRoomList, setRoomList, setFloorList, getFloorList } from '@/apis/houseApi'
import { validKeyboard } from '@/hooks/useFormValidator'
import houseStore from '@/store/houseStore'
import { objDelByValues } from '@/utils/common'

const useHouseStore = houseStore()

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
const { floorList, currentHouse, roomList } = storeToRefs(useHouseStore)

const activeNames = ref([0])
const checkboxRefs = ref([]) // 默认房间checkbox
const showRoomChecked = ref(false) // 是否打开默认房间列表
const showRoomCustom = ref(false) // 是否打开房间自定义
const roomForm = ref({ checked: [] }) // 记录当前选择的楼层与房间名称index=>楼层，checked: 选择的房间
const showAddFloor = ref(false) //是否打开楼层弹框
const floorForm = ref({ op: 2, mingcheng: '' }) // 楼层数据表单
const loading = ref(false)

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
  floorForm.value = { op: 3, bianhao: item.id, mingcheng: item.label }
}

const onDelFloor = () => {
  onAwaitLoad(async () => {
    await showConfirmDialog({ title: '提示', message: `是否删除${floorForm.value.mingcheng}楼层` })
    const { useGetFloorListSync } = useHouseStore
    await getFloorList({ op: 4, quyubianhao: floorForm.value.bianhao })
    await useGetFloorListSync(true)
    showAddFloor.value = false
  })
}

const onUpdateFloor = () => {
  onAwaitLoad(async () => {
    const { useGetFloorListSync } = useHouseStore
    const { op, mingcheng, bianhao } = floorForm.value
    const config = {
      params: { op },
      data: objDelByValues([undefined, null], {
        bianhao,
        mingcheng,
        fangwubianhao: currentHouse.value?.id,
        paixu: floorList.value.length,
      }),
    }
    console.log(config)
    await setFloorList(config)
    await useGetFloorListSync(true)
  })
}

//新增房间
const openAddRoom = (floorItem, floorIndex) => {
  showRoomChecked.value = true

  roomForm.value = {
    fangwubianhao: currentHouse.value?.id,
    quyubianhao: floorItem.id,
    index: floorIndex,
    checked: [],
  }
}

// 删除房间
const onDelectRoom = async (roomItem) => {
  onAwaitLoad(async () => {
    await showConfirmDialog({ title: '提示', message: `是否删除 ${roomItem.label} 房间` })
    const { useGetRoomListSync } = useHouseStore
    await getRoomList({ op: 4, fangjianbianhao: roomItem.id })
    await useGetRoomListSync()
  })
}

// 新增房间
const onAddRoomItem = () => {
  onAwaitLoad(async () => {
    console.log(roomForm.value.checked)
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
    showRoomChecked.value = false
  })
}

// 提交自定义房间
const onSubmitRoomCustom = () => {
  onAwaitLoad(async () => {
    const data = {
      fangwubianhao: roomForm.value.fangwubianhao,
      quyubianhao: roomForm.value.quyubianhao,
      mingcheng: roomForm.value.name,
    }
    await setRoomList({ params: { op: 2 }, data })
    showRoomCustom.value = false
    showRoomChecked.value = false
  })
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
          type="primary"
          :loading="loading"
          @click="addFloorItem"
        >
          添加楼层
        </van-button>
      </template>
    </HeaderNavbar>

    <van-collapse v-model="activeNames">
      <van-collapse-item
        v-for="(floorItem, floorIndex) in floorList"
        :key="floorItem.id"
        :title="floorItem.label"
        center
      >
        <template #value>
          <van-button
            round
            class="!mr-4"
            size="small"
            type="primary"
            icon="edit"
            :loading="loading"
            @click.stop="onEditFloor(floorItem)"
          >
            编辑楼层
          </van-button>
        </template>
        <div class="flex flex-wrap">
          <span
            v-for="roomItem in roomList.filter((item) => item.fId == floorItem.id)"
            :key="roomItem.bianhao"
            class="relative mb-4 mr-4"
          >
            <van-button
              round
              icon="delete-o"
              class="!px-4"
              size="small"
              :loading="loading"
              @click.stop="onDelectRoom(roomItem)"
            >
              {{ roomItem.mingcheng }}
            </van-button>
          </span>
          <van-button
            round
            size="small"
            type="primary"
            icon="add-o"
            :loading="loading"
            @click.stop="openAddRoom(floorItem, floorIndex)"
          >
            添加房间
          </van-button>
        </div>
      </van-collapse-item>
    </van-collapse>

    <!--新增房间-->
    <van-popup v-model:show="showRoomChecked" round teleport="body" position="bottom">
      <div class="py-4">
        <div class="flex justify-between p-4">
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
          <van-button
            class="!px-4"
            round
            type="primary"
            size="small"
            :loading="loading"
            @click="onAddRoomItem"
          >
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
            <van-cell title="自定义" is-link @click="showRoomCustom = true"></van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>

    <!--自定义房间名称-->
    <van-popup v-model:show="showRoomCustom" round teleport="body" position="center">
      <div class="py-4">
        <van-form @submit="onSubmitRoomCustom">
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
            <van-button round block type="primary" native-type="submit" :loading="loading">
              提交
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!--楼层弹框-->
    <van-popup v-model:show="showAddFloor" round teleport="body" position="center" closeable>
      <van-form class="p-4" @submit="onUpdateFloor">
        <div class="pb-4">{{ floorForm.op != 2 ? '编辑' : '添加' }}楼层</div>
        <van-field
          v-model.trim="floorForm.mingcheng"
          name="floorName"
          label="楼层名称"
          placeholder="请填写楼层名称"
          :rules="[
            { required: true, message: '楼层名称不能为空' },
            { validator: (value) => validKeyboard(value), message: '只能填写中英文、数字与.' },
          ]"
        />

        <div class="pt-8 pb-4 space-x-4 flex items-center">
          <van-button
            v-if="floorForm.op != 2"
            round
            block
            type="primary"
            :loading="loading"
            @click="onDelFloor"
          >
            删除
          </van-button>
          <van-button round block type="primary" native-type="submit" :loading="loading">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
