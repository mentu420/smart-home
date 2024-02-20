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
import { getWebUrlName } from '@/utils/common'

defineOptions({ name: 'MeHouse' })

const route = useRoute()
const router = useRouter()
const showQrCode = ref(false)
const { userInfo } = storeToRefs(userStore())
const { familyList, houseList, getRolePowerName, houseUserPower } = storeToRefs(houseStore())
const loading = ref(false)
const houseItem = computed(
  () => houseList.value.find((houseItem) => houseItem.id == route.query.id) || {}
)
const houseImage = computed(() => houseItem.value?.img)
const houseFamilyList = computed(() =>
  familyList.value
    .filter((familyItem) => familyItem.fangwubianhao == houseItem.value.id)
    .sort((a, b) => {
      return b.fangzhu - a.fangzhu || b.juese - a.juese
    })
)
// 当前用户是否当前房屋的所有者或者管理员
const disabled = ref(houseUserPower.value(route.query.id) == 2)

//变更图片
const onHouseChange = async (fileList) => {
  try {
    loading.value = true
    const { url } = fileList[0]
    await setHouseItem({
      params: { op: 3 },
      data: {
        bianhao: houseItem.value.id,
        mingcheng: houseItem.value.label,
        img: getWebUrlName(url),
      },
    })
    const { setHouseList } = houseStore()
    setHouseList({
      ...houseItem.value,
      img: url,
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
    router.goBack()
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
          accept="image/*"
          string-separator=","
          :max-count="1"
          :disabled="disabled"
          :deletable="!disabled"
          @success="onHouseChange"
        >
          <template #default="slotProps">
            <div class="w-[80px] h-[80px] flex justify-center items-center bg-page-gray">
              <van-loading v-if="slotProps.loading" />
              <SmartImage v-else class="w-[80px] h-[80px]" fit="cover" round :src="houseImage" />
            </div>
          </template>
        </SmartUploader>
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

    <div v-if="!disabled" class="p-6 mb-safe">
      <van-button :loading="loading" round block @click="onDelHouse"> 删除家庭 </van-button>
    </div>

    <van-popup v-model:show="showQrCode" round teleport="body" position="center">
      <div>
        <vue-qr :text="houseItem?.id" :size="200"></vue-qr>
      </div>
    </van-popup>
  </div>
</template>
