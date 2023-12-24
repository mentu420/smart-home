<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog, showDialog } from 'vant'
import { computed, ref } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { useRoute, useRouter } from 'vue-router'

import { setHouseItem, getHouseList } from '@/apis/houseApi'
import SmartUploader from '@/components/common/SmartUploader.vue'
import houseStore from '@/store/houseStore'
import userStore from '@/store/userStore'

defineOptions({ name: 'MeHouse' })

const route = useRoute()
const router = useRouter()
const showQrCode = ref(false)
const { userInfo } = storeToRefs(userStore())
const { familyList, houseList, getRolePowerName } = storeToRefs(houseStore())
const houseImage = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')
const loading = ref(false)
const houseItem = computed(
  () => houseList.value.find((houseItem) => houseItem.id == route.query.id) || {}
)
const houseFamilyList = computed(() =>
  familyList.value
    .filter((familyItem) => familyItem.fangwubianhao == houseItem.value.id)
    .sort((a, b) => {
      return b.fangzhu - a.fangzhu || b.juese - a.juese
    })
)
const { getRolePower } = houseStore()
// 当前用户是否当前房屋的所有者或者管理员
const disabled = computed(() => getRolePower(route.query.id) == 2)

//变更图片
const onHouseChange = async () => {
  try {
    loading.value = true
    await setHouseItem({
      params: { op: 2 },
      data: {
        bianhao: houseItem.value.id,
        mingcheng: houseItem.value.label,
        img: houseImage.value,
      },
    })
    const { setHouseList } = houseStore()
    setHouseList({
      ...houseItem.value,
      img: houseImage.value,
    })
  } finally {
    loading.value = false
  }
}

const onDelHouse = async () => {
  try {
    loading.value = true
    await showConfirmDialog({ title: '提示', message: '是否删除当前房屋' })
    await getHouseList({ op: 4, fangwubianhao: houseItem.value.id })
    const { useGetHouseListSync } = houseStore()
    await useGetHouseListSync(true)
    router.back()
  } catch (err) {
    //
  } finally {
    loading.value = false
  }
}

const editHouseName = () => {
  if (disabled.value) return
  router.push({
    path: '/me-house-name',
    query: { houseName: houseItem.value.fangwumingcheng, id: houseItem.value.bianhao },
  })
}

const editHouseAddress = () => {
  if (disabled.value) return
  router.push({ path: '/me-house-map' })
}

const editHouseManage = () => {
  if (disabled.value) return
  router.push({ path: '/me-room-manage', query: route.query })
}

const addHouseItem = () => {
  if (disabled.value) return
  router.push({ path: '/me-house-create' })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理">
      <template #right>
        <van-icon v-if="!disabled" size="20" name="plus" @click="addHouseItem" />
      </template>
    </HeaderNavbar>
    <van-cell-group>
      <van-cell
        center
        clickable
        title="家庭名称"
        :value="houseItem?.fangwumingcheng"
        is-link
        @click="editHouseName"
      />
      <van-cell
        center
        clickable
        title="家庭位置"
        :value="houseItem?.dizhi"
        is-link
        @click="editHouseAddress"
      />
      <van-cell center clickable title="家庭图片" is-link>
        <SmartUploader
          v-model="houseImage"
          v-model:loading="loading"
          accept="image/*"
          string-separator=","
          :max-count="1"
          :disabled="disabled"
          :deletable="!disabled"
          @success="onHouseChange"
        />
      </van-cell>
      <van-cell center clickable title="家庭二维码" is-link @click="showQrCode = true">
        <IconFont icon="system-QRcode" />
      </van-cell>
      <div class="h-4 bg-page-gray"></div>
      <van-cell
        center
        clickable
        title="我的权限"
        :value="
          getRolePowerName(houseFamilyList.find((item) => item.shouji == userInfo.shouji) || {})
        "
        is-link
      />
      <van-cell center clickable title="房间管理" is-link @click="editHouseManage" />
    </van-cell-group>

    <section class="p-4">
      <dl class="rounded-lg bg-white overflow-hidden">
        <dt class="p-4 flex justify-between items-center">
          <p class="space-x-2">
            <label>家庭成员</label>
            <label class="text-xs text-gray-300">({{ houseFamilyList.length }})</label>
          </p>
          <p
            v-if="!disabled"
            class="space-x-2 text-primary"
            @click="router.push({ path: '/me-house-invite', query: route.query })"
          >
            <van-icon name="plus" />
            <label>添加</label>
          </p>
        </dt>
        <dd>
          <van-cell-group>
            <van-cell
              v-for="familyItem in houseFamilyList"
              :key="familyItem.id"
              center
              clickable
              is-link
              :title="familyItem.label"
              :value="getRolePowerName(familyItem)"
              @click="
                router.push({
                  path: '/me-house-member-item',
                  query: { id: familyItem.id, hId: familyItem.fangwubianhao },
                })
              "
            />
          </van-cell-group>
        </dd>
      </dl>
    </section>

    <div v-if="!disabled" class="m-6">
      <van-button :loading="loading" round block type="primary" @click="onDelHouse">
        删除家庭
      </van-button>
    </div>

    <van-popup v-model:show="showQrCode" round teleport="body" position="center">
      <div>
        <vue-qr :text="houseItem?.id" :size="200"></vue-qr>
      </div>
    </van-popup>
  </div>
</template>
